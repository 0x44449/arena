package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.channel.dtos.ChannelDto;
import app.sandori.arena.api.domain.channel.dtos.ChannelMemberDto;
import app.sandori.arena.api.domain.channel.dtos.CreateDmDto;
import app.sandori.arena.api.domain.channel.dtos.CreateGroupDto;
import app.sandori.arena.api.domain.channel.dtos.InviteMembersDto;
import app.sandori.arena.api.domain.org.OrgMemberRepository;
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
    private final OrgMemberRepository orgMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public ChannelService(
            ChannelRepository channelRepository,
            ChannelMemberRepository channelMemberRepository,
            OrgMemberRepository orgMemberRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.channelRepository = channelRepository;
        this.channelMemberRepository = channelMemberRepository;
        this.orgMemberRepository = orgMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public ChannelDto createDm(String uid, String orgId, CreateDmDto request) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());
        requireOrgMember(orgId, request.targetUserId());

        // 자기 자신과 DM 불가
        if (user.getUserId().equals(request.targetUserId())) {
            throw new WellKnownException("CANNOT_DM_SELF");
        }

        // 기존 DM 있으면 반환
        var existing = channelRepository.findDmBetween(orgId, user.getUserId(), request.targetUserId());
        if (existing.isPresent()) {
            return toChannelDto(existing.get(), orgId);
        }

        ChannelEntity channel = new ChannelEntity(orgId, ChannelEntity.TYPE_DM, null, user.getUserId());
        channelRepository.save(channel);

        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), user.getUserId()));
        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), request.targetUserId()));

        return toChannelDto(channel, orgId);
    }

    public ChannelDto createGroup(String uid, String orgId, CreateGroupDto request) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());

        // 모든 멤버가 Org 소속인지 확인
        for (String memberId : request.memberUserIds()) {
            requireOrgMember(orgId, memberId);
        }

        ChannelEntity channel = new ChannelEntity(orgId, ChannelEntity.TYPE_GROUP, request.name(), user.getUserId());
        channelRepository.save(channel);

        // 생성자 + 지정 멤버 추가
        channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), user.getUserId()));
        for (String memberId : request.memberUserIds()) {
            if (!memberId.equals(user.getUserId())) {
                channelMemberRepository.save(new ChannelMemberEntity(channel.getChannelId(), memberId));
            }
        }

        return toChannelDto(channel, orgId);
    }

    public List<ChannelDto> getMyChannels(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());

        // 내가 속한 대화방 ID 목록
        List<ChannelMemberEntity> myMemberships = channelMemberRepository.findAllByUserIdAndDeletedAtIsNull(user.getUserId());
        List<String> channelIds = myMemberships.stream()
                .map(ChannelMemberEntity::getChannelId)
                .toList();

        List<ChannelDto> result = new ArrayList<>();
        for (String channelId : channelIds) {
            ChannelEntity channel = channelRepository.findByChannelIdAndDeletedAtIsNull(channelId).orElse(null);
            if (channel == null || !channel.getOrgId().equals(orgId)) continue;
            result.add(toChannelDto(channel, orgId));
        }

        return result;
    }

    public ChannelDto getChannel(String uid, String orgId, String channelId) {
        UserEntity user = findUserByUid(uid);
        ChannelEntity channel = findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, user.getUserId());

        return toChannelDto(channel, orgId);
    }

    public ChannelDto inviteMembers(String uid, String orgId, String channelId, InviteMembersDto request) {
        UserEntity user = findUserByUid(uid);
        ChannelEntity channel = findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, user.getUserId());

        // DM은 초대 불가
        if (ChannelEntity.TYPE_DM.equals(channel.getType())) {
            throw new WellKnownException("CANNOT_INVITE_TO_DM");
        }

        for (String memberId : request.userIds()) {
            requireOrgMember(orgId, memberId);
            if (!channelMemberRepository.existsByChannelIdAndUserIdAndDeletedAtIsNull(channelId, memberId)) {
                channelMemberRepository.save(new ChannelMemberEntity(channelId, memberId));
            }
        }

        return toChannelDto(channel, orgId);
    }

    public void leaveChannel(String uid, String orgId, String channelId) {
        UserEntity user = findUserByUid(uid);
        ChannelEntity channel = findActiveChannel(channelId, orgId);

        // DM은 나가기 불가
        if (ChannelEntity.TYPE_DM.equals(channel.getType())) {
            throw new WellKnownException("CANNOT_LEAVE_DM");
        }

        ChannelMemberEntity member = channelMemberRepository
                .findByChannelIdAndUserIdAndDeletedAtIsNull(channelId, user.getUserId())
                .orElseThrow(() -> new WellKnownException("NOT_CHANNEL_MEMBER"));

        member.softDelete();
        channelMemberRepository.save(member);
    }

    private ChannelDto toChannelDto(ChannelEntity channel, String orgId) {
        List<ChannelMemberEntity> members = channelMemberRepository
                .findAllByChannelIdAndDeletedAtIsNull(channel.getChannelId());
        List<ProfileEntity> profiles = profileRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);

        Map<String, ProfileEntity> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileEntity::getUserId, Function.identity()));

        List<ChannelMemberDto> memberDtos = members.stream()
                .map(m -> ChannelMemberDto.from(m, profileMap.get(m.getUserId())))
                .toList();

        return ChannelDto.from(channel, memberDtos);
    }

    private UserEntity findUserByUid(String uid) {
        return userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
    }

    private ChannelEntity findActiveChannel(String channelId, String orgId) {
        ChannelEntity channel = channelRepository.findByChannelIdAndDeletedAtIsNull(channelId)
                .orElseThrow(() -> new WellKnownException("CHANNEL_NOT_FOUND"));
        if (!channel.getOrgId().equals(orgId)) {
            throw new WellKnownException("CHANNEL_NOT_FOUND");
        }
        return channel;
    }

    private void requireOrgMember(String orgId, String userId) {
        if (!orgMemberRepository.existsByOrgIdAndUserIdAndDeletedAtIsNull(orgId, userId)) {
            throw new WellKnownException("NOT_ORG_MEMBER");
        }
    }

    private void requireChannelMember(String channelId, String userId) {
        if (!channelMemberRepository.existsByChannelIdAndUserIdAndDeletedAtIsNull(channelId, userId)) {
            throw new WellKnownException("NOT_CHANNEL_MEMBER");
        }
    }
}
