package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.domain.org.dtos.CreateOrgDto;
import app.sandori.arena.api.domain.org.dtos.InviteCodeDto;
import app.sandori.arena.api.domain.org.dtos.JoinOrgDto;
import app.sandori.arena.api.domain.org.dtos.OrgDto;
import app.sandori.arena.api.domain.org.dtos.UpdateOrgDto;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.profile.dtos.ProfileDto;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrgService {

    private final OrgRepository orgRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public OrgService(
            OrgRepository orgRepository,
            InviteCodeRepository inviteCodeRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.orgRepository = orgRepository;
        this.inviteCodeRepository = inviteCodeRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public OrgDto createOrg(String uid, CreateOrgDto request) {
        UserEntity user = findUserByUid(uid);

        OrgEntity org = new OrgEntity(request.name(), request.description().orElse(null));
        orgRepository.save(org);

        // 기본 프로필 이름으로 Org 프로필 생성 (OWNER)
        ProfileEntity defaultProfile = findDefaultProfile(user.getUserId());
        ProfileEntity orgProfile = new ProfileEntity(
                user.getUserId(), org.getOrgId(), defaultProfile.getName(), ProfileEntity.ROLE_OWNER);
        profileRepository.save(orgProfile);

        return OrgDto.from(org, orgProfile.getRole());
    }

    public List<OrgDto> getMyOrgs(String uid) {
        UserEntity user = findUserByUid(uid);

        List<ProfileEntity> orgProfiles = profileRepository
                .findAllByUserIdAndOrgIdIsNotNullAndDeletedAtIsNull(user.getUserId());

        return orgProfiles.stream()
                .map(profile -> {
                    OrgEntity org = orgRepository.findByOrgIdAndDeletedAtIsNull(profile.getOrgId()).orElse(null);
                    if (org == null) return null;
                    return OrgDto.from(org, profile.getRole());
                })
                .filter(o -> o != null)
                .toList();
    }

    public OrgDto getOrg(String uid, String orgId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        OrgEntity org = findActiveOrg(orgId);

        return OrgDto.from(org, profile.getRole());
    }

    public OrgDto updateOrg(String uid, String orgId, UpdateOrgDto request) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);
        OrgEntity org = findActiveOrg(orgId);

        request.name().ifPresent(org::changeName);
        request.description().ifPresent(org::changeDescription);
        request.avatarFileId().ifPresent(org::changeAvatarFileId);

        orgRepository.save(org);
        return OrgDto.from(org, ProfileEntity.ROLE_OWNER);
    }

    public List<ProfileDto> getMembers(String uid, String orgId) {
        findOrgProfile(uid, orgId);

        return profileRepository.findAllByOrgIdAndDeletedAtIsNull(orgId).stream()
                .map(ProfileDto::from)
                .toList();
    }

    public void removeMember(String uid, String orgId, String profileId) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);
        requireOwner(myProfile);

        ProfileEntity target = profileRepository.findByProfileIdAndDeletedAtIsNull(profileId)
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));

        if (!orgId.equals(target.getOrgId())) {
            throw new WellKnownException("PROFILE_NOT_FOUND");
        }

        // 자신은 추방 불가
        if (myProfile.getProfileId().equals(target.getProfileId())) {
            throw new WellKnownException("CANNOT_REMOVE_SELF");
        }

        target.softDelete();
        profileRepository.save(target);
    }

    public void leaveOrg(String uid, String orgId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);

        // OWNER는 탈퇴 불가
        if (ProfileEntity.ROLE_OWNER.equals(profile.getRole())) {
            throw new WellKnownException("OWNER_CANNOT_LEAVE");
        }

        profile.softDelete();
        profileRepository.save(profile);
    }

    public InviteCodeDto createInviteCode(String uid, String orgId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);
        findActiveOrg(orgId);

        InviteCodeEntity inviteCode = new InviteCodeEntity(orgId, profile.getProfileId());
        inviteCodeRepository.save(inviteCode);

        return InviteCodeDto.from(inviteCode);
    }

    public List<InviteCodeDto> getInviteCodes(String uid, String orgId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);

        return inviteCodeRepository.findAllByOrgIdAndDeletedAtIsNull(orgId).stream()
                .map(InviteCodeDto::from)
                .toList();
    }

    public void deleteInviteCode(String uid, String orgId, String inviteCodeId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);

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

        if (profileRepository.existsByUserIdAndOrgIdAndDeletedAtIsNull(user.getUserId(), orgId)) {
            throw new WellKnownException("ALREADY_MEMBER");
        }

        OrgEntity org = findActiveOrg(orgId);

        // Org 전용 프로필 생성 (USER)
        ProfileEntity defaultProfile = findDefaultProfile(user.getUserId());
        ProfileEntity orgProfile = new ProfileEntity(
                user.getUserId(), orgId, defaultProfile.getName(), ProfileEntity.ROLE_USER);
        profileRepository.save(orgProfile);

        return OrgDto.from(org, ProfileEntity.ROLE_USER);
    }

    private UserEntity findUserByUid(String uid) {
        return userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
    }

    private ProfileEntity findDefaultProfile(String userId) {
        return profileRepository.findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
    }

    private ProfileEntity findOrgProfile(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        return profileRepository.findByUserIdAndOrgIdAndDeletedAtIsNull(user.getUserId(), orgId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
    }

    private OrgEntity findActiveOrg(String orgId) {
        return orgRepository.findByOrgIdAndDeletedAtIsNull(orgId)
                .orElseThrow(() -> new WellKnownException("ORG_NOT_FOUND"));
    }

    private void requireOwner(ProfileEntity profile) {
        if (!ProfileEntity.ROLE_OWNER.equals(profile.getRole())) {
            throw new WellKnownException("PERMISSION_DENIED");
        }
    }
}
