package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.domain.org.dtos.CreateOrgDto;
import app.sandori.arena.api.domain.org.dtos.InviteCodeDto;
import app.sandori.arena.api.domain.org.dtos.JoinOrgDto;
import app.sandori.arena.api.domain.org.dtos.OrgDto;
import app.sandori.arena.api.domain.org.dtos.OrgMemberDto;
import app.sandori.arena.api.domain.org.dtos.UpdateOrgDto;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class OrgService {

    private final OrgRepository orgRepository;
    private final OrgMemberRepository orgMemberRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public OrgService(
            OrgRepository orgRepository,
            OrgMemberRepository orgMemberRepository,
            InviteCodeRepository inviteCodeRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.orgRepository = orgRepository;
        this.orgMemberRepository = orgMemberRepository;
        this.inviteCodeRepository = inviteCodeRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public OrgDto createOrg(String uid, CreateOrgDto request) {
        UserEntity user = findUserByUid(uid);

        OrgEntity org = new OrgEntity(request.name(), request.description().orElse(null));
        orgRepository.save(org);

        OrgMemberEntity member = new OrgMemberEntity(org.getOrgId(), user.getUserId(), OrgMemberEntity.ROLE_OWNER);
        orgMemberRepository.save(member);

        // 기본 프로필 이름을 Org 프로필로 복사
        ProfileEntity defaultProfile = profileRepository
                .findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(user.getUserId())
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
        ProfileEntity orgProfile = new ProfileEntity(user.getUserId(), org.getOrgId(), defaultProfile.getName());
        profileRepository.save(orgProfile);

        return OrgDto.from(org, OrgMemberEntity.ROLE_OWNER);
    }

    public List<OrgDto> getMyOrgs(String uid) {
        UserEntity user = findUserByUid(uid);

        List<OrgMemberEntity> memberships = orgMemberRepository.findAllByUserIdAndDeletedAtIsNull(user.getUserId());

        return memberships.stream()
                .map(m -> {
                    OrgEntity org = orgRepository.findByOrgIdAndDeletedAtIsNull(m.getOrgId()).orElse(null);
                    if (org == null) return null;
                    return OrgDto.from(org, m.getRole());
                })
                .filter(o -> o != null)
                .toList();
    }

    public OrgDto getOrg(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        OrgMemberEntity member = findActiveMember(orgId, user.getUserId());
        OrgEntity org = findActiveOrg(orgId);

        return OrgDto.from(org, member.getRole());
    }

    public OrgDto updateOrg(String uid, String orgId, UpdateOrgDto request) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());
        OrgEntity org = findActiveOrg(orgId);

        request.name().ifPresent(org::changeName);
        request.description().ifPresent(org::changeDescription);
        request.avatarFileId().ifPresent(org::changeAvatarFileId);

        orgRepository.save(org);
        return OrgDto.from(org, OrgMemberEntity.ROLE_OWNER);
    }

    public List<OrgMemberDto> getMembers(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        findActiveMember(orgId, user.getUserId());

        List<OrgMemberEntity> members = orgMemberRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);
        List<ProfileEntity> profiles = profileRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);

        Map<String, ProfileEntity> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileEntity::getUserId, Function.identity()));

        return members.stream()
                .map(m -> OrgMemberDto.from(m, profileMap.get(m.getUserId())))
                .toList();
    }

    public void removeMember(String uid, String orgId, String orgMemberId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        OrgMemberEntity target = orgMemberRepository.findByOrgMemberIdAndDeletedAtIsNull(orgMemberId)
                .orElseThrow(() -> new WellKnownException("MEMBER_NOT_FOUND"));

        if (!target.getOrgId().equals(orgId)) {
            throw new WellKnownException("MEMBER_NOT_FOUND");
        }

        // OWNER 자신은 추방 불가
        if (target.getUserId().equals(user.getUserId())) {
            throw new WellKnownException("CANNOT_REMOVE_SELF");
        }

        target.softDelete();
        orgMemberRepository.save(target);
    }

    public void leaveOrg(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        OrgMemberEntity member = findActiveMember(orgId, user.getUserId());

        // OWNER는 탈퇴 불가
        if (OrgMemberEntity.ROLE_OWNER.equals(member.getRole())) {
            throw new WellKnownException("OWNER_CANNOT_LEAVE");
        }

        member.softDelete();
        orgMemberRepository.save(member);
    }

    public InviteCodeDto createInviteCode(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());
        findActiveOrg(orgId);

        InviteCodeEntity inviteCode = new InviteCodeEntity(orgId, user.getUserId());
        inviteCodeRepository.save(inviteCode);

        return InviteCodeDto.from(inviteCode);
    }

    public List<InviteCodeDto> getInviteCodes(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        return inviteCodeRepository.findAllByOrgIdAndDeletedAtIsNull(orgId).stream()
                .map(InviteCodeDto::from)
                .toList();
    }

    public void deleteInviteCode(String uid, String orgId, String inviteCodeId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        InviteCodeEntity inviteCode = inviteCodeRepository.findByInviteCodeIdAndDeletedAtIsNull(inviteCodeId)
                .orElseThrow(() -> new WellKnownException("INVITE_CODE_NOT_FOUND"));

        if (!inviteCode.getOrgId().equals(orgId)) {
            throw new WellKnownException("INVITE_CODE_NOT_FOUND");
        }

        inviteCode.softDelete();
        inviteCodeRepository.save(inviteCode);
    }

    public OrgDto joinOrg(String uid, JoinOrgDto request) {
        UserEntity user = findUserByUid(uid);

        InviteCodeEntity inviteCode = inviteCodeRepository.findByCodeAndDeletedAtIsNull(request.code())
                .orElseThrow(() -> new WellKnownException("INVALID_INVITE_CODE"));

        String orgId = inviteCode.getOrgId();

        if (orgMemberRepository.existsByOrgIdAndUserIdAndDeletedAtIsNull(orgId, user.getUserId())) {
            throw new WellKnownException("ALREADY_MEMBER");
        }

        OrgEntity org = findActiveOrg(orgId);

        OrgMemberEntity member = new OrgMemberEntity(orgId, user.getUserId(), OrgMemberEntity.ROLE_USER);
        orgMemberRepository.save(member);

        // Org 전용 프로필 생성 (기본 프로필 이름 복사)
        ProfileEntity defaultProfile = profileRepository
                .findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(user.getUserId())
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
        ProfileEntity orgProfile = new ProfileEntity(user.getUserId(), orgId, defaultProfile.getName());
        profileRepository.save(orgProfile);

        return OrgDto.from(org, OrgMemberEntity.ROLE_USER);
    }

    private UserEntity findUserByUid(String uid) {
        return userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
    }

    private OrgEntity findActiveOrg(String orgId) {
        return orgRepository.findByOrgIdAndDeletedAtIsNull(orgId)
                .orElseThrow(() -> new WellKnownException("ORG_NOT_FOUND"));
    }

    private OrgMemberEntity findActiveMember(String orgId, String userId) {
        return orgMemberRepository.findByOrgIdAndUserIdAndDeletedAtIsNull(orgId, userId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
    }

    private void requireOwner(String orgId, String userId) {
        OrgMemberEntity member = findActiveMember(orgId, userId);
        if (!OrgMemberEntity.ROLE_OWNER.equals(member.getRole())) {
            throw new WellKnownException("PERMISSION_DENIED");
        }
    }
}
