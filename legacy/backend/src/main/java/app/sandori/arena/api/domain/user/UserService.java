package app.sandori.arena.api.domain.user;

import app.sandori.arena.api.domain.file.FileService;
import app.sandori.arena.api.domain.user.dtos.CreateUserRequest;
import app.sandori.arena.api.domain.user.dtos.UpdateUserRequest;
import app.sandori.arena.api.global.exception.WellKnownException;
import app.sandori.arena.api.global.signal.Signal;
import app.sandori.arena.api.global.signal.SignalChannel;
import app.sandori.arena.api.global.util.IdGenerator;
import java.security.SecureRandom;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final int UTAG_LENGTH = 6;
    private static final String UTAG_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int MAX_UTAG_ATTEMPTS = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final FileService fileService;
    private final Signal signal;

    @Transactional(readOnly = true)
    public UserEntity findByUid(String uid) {
        return userRepository.findByUidAndDeletedAtIsNull(uid).orElse(null);
    }

    @Transactional(readOnly = true)
    public UserEntity getByUserId(String userId) {
        return userRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND", "User not found"));
    }

    @Transactional
    public UserEntity create(String uid, CreateUserRequest dto) {
        UserEntity existing = findByUid(uid);
        if (existing != null) {
            throw new WellKnownException("ALREADY_EXISTS_USER", "User already exists");
        }

        String utag = generateUniqueUtag();

        UserEntity user = UserEntity.builder()
                .userId(IdGenerator.generate())
                .uid(uid)
                .utag(utag)
                .nick(dto.getNick())
                .email(dto.getEmail())
                .statusMessage(dto.getStatusMessage())
                .avatarFileId(null)
                .build();

        userRepository.save(user);

        signal.publish(SignalChannel.USER_UPDATED, Map.of("uid", uid));

        return userRepository.findByUidAndDeletedAtIsNull(uid).orElseThrow();
    }

    @Transactional
    public UserEntity update(String userId, UpdateUserRequest dto) {
        UserEntity user = getByUserId(userId);

        if (dto.getNick() != null) {
            user.setNick(dto.getNick());
        }
        if (dto.getStatusMessage() != null) {
            user.setStatusMessage(dto.getStatusMessage());
        }
        if (dto.isAvatarFileIdProvided()) {
            if (dto.getAvatarFileId() != null) {
                fileService.getFileById(dto.getAvatarFileId());
            }
            user.setAvatarFileId(dto.getAvatarFileId());
        }

        userRepository.save(user);

        signal.publish(SignalChannel.USER_UPDATED, Map.of("uid", user.getUid()));

        return userRepository.findByUserIdAndDeletedAtIsNull(userId).orElseThrow();
    }

    private String generateUniqueUtag() {
        for (int attempt = 0; attempt < MAX_UTAG_ATTEMPTS; attempt++) {
            String candidate = generateRandomUtag();
            if (!userRepository.existsByUtag(candidate)) {
                return candidate;
            }
        }
        throw new WellKnownException("UTAG_GENERATION_FAILED", "Failed to generate unique utag");
    }

    private String generateRandomUtag() {
        StringBuilder sb = new StringBuilder(UTAG_LENGTH);
        for (int i = 0; i < UTAG_LENGTH; i++) {
            sb.append(UTAG_CHARSET.charAt(RANDOM.nextInt(UTAG_CHARSET.length())));
        }
        return sb.toString();
    }
}
