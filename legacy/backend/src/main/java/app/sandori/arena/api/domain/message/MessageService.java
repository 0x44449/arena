package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.domain.channel.ChannelRepository;
import app.sandori.arena.api.domain.channel.ParticipantRepository;
import app.sandori.arena.api.domain.message.dtos.MessageResponse;
import app.sandori.arena.api.global.exception.WellKnownException;
import app.sandori.arena.api.global.signal.Signal;
import app.sandori.arena.api.global.signal.SignalChannel;
import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private static final int SYNC_LIMIT = 100;

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final ParticipantRepository participantRepository;
    private final Signal signal;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public MessageEntity createMessage(String userId, String channelId, String content) {
        participantRepository.findByChannelIdAndUserIdAndDeletedAtIsNull(channelId, userId)
                .orElseThrow(() -> new WellKnownException("NOT_PARTICIPANT",
                        "Not a participant of this channel"));

        String messageId = IdGenerator.generate();

        entityManager.createNativeQuery("""
                INSERT INTO "messages" ("messageId", "channelId", "senderId", "seq", "content", "createdAt", "updatedAt")
                VALUES (?1, ?2, ?3,
                    (SELECT COALESCE(MAX("seq"), 0) + 1 FROM "messages" WHERE "channelId" = ?4),
                    ?5, NOW(), NOW())
                """)
                .setParameter(1, messageId)
                .setParameter(2, channelId)
                .setParameter(3, userId)
                .setParameter(4, channelId)
                .setParameter(5, content)
                .executeUpdate();

        // channel.lastMessageAt 업데이트
        channelRepository.findById(channelId).ifPresent(channel -> {
            channel.setLastMessageAt(LocalDateTime.now());
            channelRepository.save(channel);
        });

        entityManager.flush();
        entityManager.clear();

        MessageEntity messageWithSender = messageRepository
                .findByMessageIdAndDeletedAtIsNull(messageId)
                .orElseThrow();

        signal.publish(SignalChannel.MESSAGE_NEW, Map.of(
                "channelId", channelId,
                "message", MessageResponse.from(messageWithSender)
        ));

        return messageWithSender;
    }

    public record GetMessagesResult(
            List<MessageEntity> messages,
            boolean hasNext,
            boolean hasPrev
    ) {
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public GetMessagesResult getMessages(String userId, String channelId,
                                          String before, String after, String around,
                                          Integer limitParam) {
        participantRepository.findByChannelIdAndUserIdAndDeletedAtIsNull(channelId, userId)
                .orElseThrow(() -> new WellKnownException("NOT_PARTICIPANT",
                        "Not a participant of this channel"));

        int limit = limitParam != null ? limitParam : 50;

        if (around != null) {
            return getMessagesAround(channelId, around, limit);
        }
        if (before != null) {
            return getMessagesBefore(channelId, before, limit);
        }
        if (after != null) {
            return getMessagesAfter(channelId, after, limit);
        }
        return getMessagesLatest(channelId, limit);
    }

    private GetMessagesResult getMessagesAround(String channelId, String aroundMessageId, int limit) {
        MessageEntity pivot = messageRepository.findByMessageIdAndChannelId(aroundMessageId, channelId)
                .orElseThrow(() -> new WellKnownException("MESSAGE_NOT_FOUND", "Message not found"));

        int halfLimit = limit / 2;

        List<MessageEntity> beforeMessages = entityManager.createQuery(
                "SELECT m FROM MessageEntity m WHERE m.channelId = :channelId AND m.seq < :seq AND m.deletedAt IS NULL ORDER BY m.seq DESC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setParameter("seq", pivot.getSeq())
                .setMaxResults(halfLimit + 1)
                .getResultList();

        boolean hasPrev = beforeMessages.size() > halfLimit;
        List<MessageEntity> actualBefore = beforeMessages.subList(0, Math.min(halfLimit, beforeMessages.size()));

        List<MessageEntity> afterMessages = entityManager.createQuery(
                "SELECT m FROM MessageEntity m WHERE m.channelId = :channelId AND m.seq > :seq AND m.deletedAt IS NULL ORDER BY m.seq ASC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setParameter("seq", pivot.getSeq())
                .setMaxResults(halfLimit + 1)
                .getResultList();

        boolean hasNext = afterMessages.size() > halfLimit;
        List<MessageEntity> actualAfter = afterMessages.subList(0, Math.min(halfLimit, afterMessages.size()));

        List<String> messageIds = new ArrayList<>();
        actualBefore.reversed().forEach(m -> messageIds.add(m.getMessageId()));
        messageIds.add(pivot.getMessageId());
        actualAfter.forEach(m -> messageIds.add(m.getMessageId()));

        if (messageIds.isEmpty()) {
            return new GetMessagesResult(Collections.emptyList(), hasNext, hasPrev);
        }

        List<MessageEntity> messages = messageRepository.findAllByMessageIdInWithSender(messageIds);
        return new GetMessagesResult(messages, hasNext, hasPrev);
    }

    private GetMessagesResult getMessagesBefore(String channelId, String beforeMessageId, int limit) {
        MessageEntity pivot = messageRepository.findByMessageIdAndChannelId(beforeMessageId, channelId)
                .orElseThrow(() -> new WellKnownException("MESSAGE_NOT_FOUND", "Message not found"));

        List<MessageEntity> messagesDesc = entityManager.createQuery(
                "SELECT m FROM MessageEntity m LEFT JOIN FETCH m.sender s LEFT JOIN FETCH s.avatar " +
                "WHERE m.channelId = :channelId AND m.seq < :seq AND m.deletedAt IS NULL ORDER BY m.seq DESC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setParameter("seq", pivot.getSeq())
                .setMaxResults(limit + 1)
                .getResultList();

        boolean hasPrev = messagesDesc.size() > limit;
        List<MessageEntity> actual = messagesDesc.subList(0, Math.min(limit, messagesDesc.size()));
        List<MessageEntity> messages = new ArrayList<>(actual);
        Collections.reverse(messages);

        return new GetMessagesResult(messages, true, hasPrev);
    }

    private GetMessagesResult getMessagesAfter(String channelId, String afterMessageId, int limit) {
        MessageEntity pivot = messageRepository.findByMessageIdAndChannelId(afterMessageId, channelId)
                .orElseThrow(() -> new WellKnownException("MESSAGE_NOT_FOUND", "Message not found"));

        List<MessageEntity> messagesAsc = entityManager.createQuery(
                "SELECT m FROM MessageEntity m LEFT JOIN FETCH m.sender s LEFT JOIN FETCH s.avatar " +
                "WHERE m.channelId = :channelId AND m.seq > :seq AND m.deletedAt IS NULL ORDER BY m.seq ASC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setParameter("seq", pivot.getSeq())
                .setMaxResults(limit + 1)
                .getResultList();

        boolean hasNext = messagesAsc.size() > limit;
        List<MessageEntity> messages = messagesAsc.subList(0, Math.min(limit, messagesAsc.size()));

        return new GetMessagesResult(messages, hasNext, true);
    }

    private GetMessagesResult getMessagesLatest(String channelId, int limit) {
        List<MessageEntity> messagesDesc = entityManager.createQuery(
                "SELECT m FROM MessageEntity m LEFT JOIN FETCH m.sender s LEFT JOIN FETCH s.avatar " +
                "WHERE m.channelId = :channelId AND m.deletedAt IS NULL ORDER BY m.seq DESC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setMaxResults(limit + 1)
                .getResultList();

        boolean hasPrev = messagesDesc.size() > limit;
        List<MessageEntity> actual = messagesDesc.subList(0, Math.min(limit, messagesDesc.size()));
        List<MessageEntity> messages = new ArrayList<>(actual);
        Collections.reverse(messages);

        return new GetMessagesResult(messages, false, hasPrev);
    }

    @Transactional(readOnly = true)
    public MessageSyncResult syncMessages(String userId, String channelId, LocalDateTime since) {
        participantRepository.findByChannelIdAndUserIdAndDeletedAtIsNull(channelId, userId)
                .orElseThrow(() -> new WellKnownException("NOT_PARTICIPANT",
                        "Not a participant of this channel"));

        // since 이후 변경된 메시지 조회 (삭제된 것 포함)
        List<MessageEntity> messages = entityManager.createQuery(
                "SELECT m FROM MessageEntity m LEFT JOIN FETCH m.sender s LEFT JOIN FETCH s.avatar " +
                "WHERE m.channelId = :channelId AND m.updatedAt > :since ORDER BY m.seq ASC",
                        MessageEntity.class)
                .setParameter("channelId", channelId)
                .setParameter("since", since)
                .getResultList();

        if (messages.size() > SYNC_LIMIT) {
            return new MessageSyncResult(
                    Collections.emptyList(), Collections.emptyList(),
                    Collections.emptyList(), true);
        }

        List<MessageEntity> created = messages.stream()
                .filter(m -> m.getCreatedAt().isAfter(since) && m.getDeletedAt() == null)
                .toList();
        List<MessageEntity> updated = messages.stream()
                .filter(m -> !m.getCreatedAt().isAfter(since) && m.getDeletedAt() == null)
                .toList();
        List<String> deleted = messages.stream()
                .filter(m -> m.getDeletedAt() != null)
                .map(MessageEntity::getMessageId)
                .toList();

        return new MessageSyncResult(created, updated, deleted, false);
    }

    public record MessageSyncResult(
            List<MessageEntity> created,
            List<MessageEntity> updated,
            List<String> deleted,
            boolean requireFullSync
    ) {
    }
}
