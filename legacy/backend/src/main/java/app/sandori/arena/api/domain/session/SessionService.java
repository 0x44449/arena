package app.sandori.arena.api.domain.session;

import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserService;
import app.sandori.arena.api.global.signal.Signal;
import app.sandori.arena.api.global.signal.SignalChannel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

    private static final String SESSION_PREFIX = "session:";
    private static final long SESSION_TTL = 300;

    private final StringRedisTemplate redisTemplate;
    private final Signal signal;
    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    void init() {
        signal.subscribe(SignalChannel.USER_UPDATED, data -> {
            try {
                JsonNode node = objectMapper.readTree(data);
                String uid = node.get("uid").asText();
                invalidate(uid);
            } catch (Exception e) {
                log.error("Failed to handle USER_UPDATED signal", e);
            }
        });
    }

    public CachedUser getOrFetch(String uid) {
        CachedUser cached = get(uid);
        if (cached != null) {
            return cached;
        }

        UserEntity userEntity = userService.findByUid(uid);
        if (userEntity != null) {
            CachedUser cachedUser = new CachedUser(
                    userEntity.getUserId(),
                    userEntity.getUid(),
                    userEntity.getUtag(),
                    userEntity.getNick(),
                    userEntity.getEmail()
            );
            set(cachedUser);
            return cachedUser;
        }

        return null;
    }

    private CachedUser get(String uid) {
        String key = getKey(uid);
        String data = redisTemplate.opsForValue().get(key);
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.readValue(data, CachedUser.class);
        } catch (Exception e) {
            log.error("Failed to deserialize CachedUser", e);
            return null;
        }
    }

    private void set(CachedUser user) {
        String key = getKey(user.uid());
        try {
            String json = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set(key, json, SESSION_TTL, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Failed to cache user session", e);
        }
    }

    private void invalidate(String uid) {
        String key = getKey(uid);
        redisTemplate.delete(key);
    }

    private String getKey(String uid) {
        return SESSION_PREFIX + uid;
    }
}
