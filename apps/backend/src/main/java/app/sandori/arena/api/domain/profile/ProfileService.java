package app.sandori.arena.api.domain.profile;

import app.sandori.arena.api.domain.profile.dtos.ProfileDto;
import app.sandori.arena.api.domain.profile.dtos.UpdateProfileDto;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public ProfileDto updateDefaultProfile(String uid, UpdateProfileDto request) {
        UserEntity user = userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));

        ProfileEntity profile = profileRepository
                .findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(user.getUserId())
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));

        request.name().ifPresent(profile::changeName);
        request.avatarFileId().ifPresent(profile::changeAvatarFileId);

        profileRepository.save(profile);
        return ProfileDto.from(profile);
    }
}
