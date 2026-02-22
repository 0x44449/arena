package app.sandori.arena.api.global.signal;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class Signal {

    private final StringRedisTemplate redisTemplate;
    private final RedisMessageListenerContainer listenerContainer;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, List<Consumer<String>>> handlers = new ConcurrentHashMap<>();

    public void publish(String channel, Object data) {
        try {
            String json = objectMapper.writeValueAsString(data);
            redisTemplate.convertAndSend(channel, json);
        } catch (Exception e) {
            log.error("Failed to publish signal: channel={}", channel, e);
        }
    }

    public void subscribe(String channel, Consumer<String> handler) {
        handlers.computeIfAbsent(channel, k -> {
            List<Consumer<String>> list = new ArrayList<>();
            listenerContainer.addMessageListener(new MessageListener() {
                @Override
                public void onMessage(Message message, byte[] pattern) {
                    String body = new String(message.getBody());
                    List<Consumer<String>> current = handlers.get(channel);
                    if (current != null) {
                        for (Consumer<String> h : current) {
                            try {
                                h.accept(body);
                            } catch (Exception e) {
                                log.error("Signal handler error: channel={}", channel, e);
                            }
                        }
                    }
                }
            }, new ChannelTopic(channel));
            return list;
        }).add(handler);
    }
}
