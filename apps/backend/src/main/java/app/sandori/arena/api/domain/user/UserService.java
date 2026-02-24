package app.sandori.arena.api.domain.user;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.user.dtos.CreateUserDto;
import app.sandori.arena.api.domain.user.dtos.UserWithProfileDto;
import app.sandori.arena.api.global.exception.WellKnownException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public UserService(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public UserWithProfileDto createUser(String uid, String email, CreateUserDto request) {
        if (userRepository.existsByUidAndDeletedAtIsNull(uid)) {
            throw new WellKnownException("USER_ALREADY_EXISTS");
        }

        UserEntity user = new UserEntity(uid, email);
        userRepository.save(user);

        ProfileEntity profile = new ProfileEntity(user.getUserId(), null, request.name(), null);
        profileRepository.save(profile);

        return UserWithProfileDto.from(user, profile);
    }

    public UserWithProfileDto getMe(String uid) {
        UserEntity user = userRepository.findByUidAndDeletedAtIsNull(uid).orElse(null);
        if (user == null) {
            return null;
        }

        ProfileEntity profile = profileRepository
                .findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(user.getUserId())
                .orElse(null);
        if (profile == null) {
            return null;
        }

        return UserWithProfileDto.from(user, profile);
    }
}
