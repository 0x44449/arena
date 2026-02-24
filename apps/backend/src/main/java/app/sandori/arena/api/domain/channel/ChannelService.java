package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.channel.dtos.ChannelDto;
import app.sandori.arena.api.domain.channel.dtos.ChannelMemberDto;
import app.sandori.arena.api.domain.channel.dtos.CreateDmDto;
import app.sandori.arena.api.domain.channel.dtos.CreateGroupDto;
import app.sandori.arena.api.domain.channel.dtos.InviteMembersDto;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMemberRepository channelMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public ChannelService(
            ChannelRepository channelRepository,
            ChannelMemberRepository channelMemberRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.channelRepository = channelRepository;
        this.channelMemberRepository = channelMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public ChannelDto createDm(String uid, String orgId, CreateDmDto request) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);

        ProfileEntity targetProfile = profileRepository.findByProfileIdAndDeletedAtIsNull(request.targetProfileId())
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
        if (!orgId.equals(targetProfile.getOrgId())) {
            throw new WellKnownException("NOT_ORG_MEMBER");
        }

        // 자기 자신과 DM 불가
        if (myProfile.getProfileId().equals(targetProfile.getProfileId())) {
            throw new WellKnownException("CANNOT_DM_SELF");
        }

        // 기존 DM 있으면 반환
        var existing = channelRepository.findDmBetween(orgId, myProfile.getProfileId(), targetProfile.getProfileId());
        if (existing.isPresent()) {
            return toChannelDto(existing.get());
        }

        ChannelEntity channel = new ChannelEntity(orgId, ChannelEntity.TYPE_DM, null, myProfile.getProfileId());
        channelRepository.save(channel);

        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), myProfile.getProfileId()));
        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), targetProfile.getProfileId()));

        return toChannelDto(channel);
    }

    public ChannelDto createGroup(String uid, String orgId, CreateGroupDto request) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);

        // 모든 멤버가 Org 소속인지 확인
        for (String profileId : request.memberProfileIds()) {
            ProfileEntity p = profileRepository.findByProfileIdAndDeletedAtIsNull(profileId)
                    .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
            if (!orgId.equals(p.getOrgId())) {
                throw new WellKnownException("NOT_ORG_MEMBER");
            }
        }

        ChannelEntity channel = new ChannelEntity(orgId, ChannelEntity.TYPE_GROUP, request.name(), myProfile.getProfileId());
        channelRepository.save(channel);

        // 생성자 + 지정 멤버 추가
        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), myProfile.getProfileId()));
        for (String profileId : request.memberProfileIds()) {
            if (!profileId.equals(myProfile.getProfileId())) {
                channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), profileId));
            }
        }

        return toChannelDto(channel);
    }

    public List<ChannelDto> getMyChannels(String uid, String orgId) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);

        List<ChannelMemberEntity> myMemberships = channelMemberRepository
                .findAllByProfileIdAndDeletedAtIsNull(myProfile.getProfileId());

        List<ChannelDto> result = new ArrayList<>();
        for (ChannelMemberEntity membership : myMemberships) {
            ChannelEntity channel = channelRepository.findByChannelIdAndDeletedAtIsNull(membership.getChannelId())
                    .orElse(null);
            if (channel == null || !channel.getOrgId().equals(orgId)) continue;
            result.add(toChannelDto(channel));
        }

        return result;
    }

    public ChannelDto getChannel(String uid, String orgId, String channelId) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);
        ChannelEntity channel = findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, myProfile.getProfileId());

        return toChannelDto(channel);
    }

    public ChannelDto inviteMembers(String uid, String orgId, String channelId, InviteMembersDto request) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);
        ChannelEntity channel = findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, myProfile.getProfileId());

        if (ChannelEntity.TYPE_DM.equals(channel.getType())) {
            throw new WellKnownException("CANNOT_INVITE_TO_DM");
        }

        for (String profileId : request.profileIds()) {
            ProfileEntity p = profileRepository.findByProfileIdAndDeletedAtIsNull(profileId)
                    .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
            if (!orgId.equals(p.getOrgId())) {
                throw new WellKnownException("NOT_ORG_MEMBER");
            }
            if (!channelMemberRepository.existsByChannelIdAndProfileIdAndDeletedAtIsNull(channelId, profileId)) {
                channelMemberRepository.save(new ChannelMemberEntity(channelId, profileId));
            }
        }

        return toChannelDto(channel);
    }

    public void leaveChannel(String uid, String orgId, String channelId) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);
        ChannelEntity channel = findActiveChannel(channelId, orgId);

        if (ChannelEntity.TYPE_DM.equals(channel.getType())) {
            throw new WellKnownException("CANNOT_LEAVE_DM");
        }

        ChannelMemberEntity member = channelMemberRepository
                .findByChannelIdAndProfileIdAndDeletedAtIsNull(channelId, myProfile.getProfileId())
                .orElseThrow(() -> new WellKnownException("NOT_CHANNEL_MEMBER"));

        member.softDelete();
        channelMemberRepository.save(member);
    }

    private ChannelDto toChannelDto(ChannelEntity channel) {
        List<ChannelMemberEntity> members = channelMemberRepository
                .findAllByChannelIdAndDeletedAtIsNull(channel.getChannelId());

        Map<String, ProfileEntity> profileMap = members.stream()
                .map(m -> profileRepository.findByProfileIdAndDeletedAtIsNull(m.getProfileId()).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toMap(ProfileEntity::getProfileId, Function.identity()));

        List<ChannelMemberDto> memberDtos = members.stream()
                .map(m -> ChannelMemberDto.from(m, profileMap.get(m.getProfileId())))
                .toList();

        return ChannelDto.from(channel, memberDtos);
    }

    private ProfileEntity findOrgProfile(String uid, String orgId) {
        UserEntity user = userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
        return profileRepository.findByUserIdAndOrgIdAndDeletedAtIsNull(user.getUserId(), orgId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
    }

    private ChannelEntity findActiveChannel(String channelId, String orgId) {
        ChannelEntity channel = channelRepository.findByChannelIdAndDeletedAtIsNull(channelId)
                .orElseThrow(() -> new WellKnownException("CHANNEL_NOT_FOUND"));
        if (!channel.getOrgId().equals(orgId)) {
            throw new WellKnownException("CHANNEL_NOT_FOUND");
        }
        return channel;
    }

    private void requireChannelMember(String channelId, String profileId) {
        if (!channelMemberRepository.existsByChannelIdAndProfileIdAndDeletedAtIsNull(channelId, profileId)) {
            throw new WellKnownException("NOT_CHANNEL_MEMBER");
        }
    }
}
