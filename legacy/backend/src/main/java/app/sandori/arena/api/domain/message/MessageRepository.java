package app.sandori.arena.api.domain.message;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {

    @EntityGraph(attributePaths = {"sender", "sender.avatar"})
    Optional<MessageEntity> findByMessageIdAndDeletedAtIsNull(String messageId);

    Optional<MessageEntity> findByMessageIdAndChannelId(String messageId, String channelId);

    @Query("SELECT m FROM MessageEntity m LEFT JOIN FETCH m.sender s LEFT JOIN FETCH s.avatar " +
            "WHERE m.messageId IN :messageIds ORDER BY m.seq ASC")
    List<MessageEntity> findAllByMessageIdInWithSender(@Param("messageIds") List<String> messageIds);
}
