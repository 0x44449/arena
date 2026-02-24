package app.sandori.arena.api.domain.message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {

    Optional<MessageEntity> findByMessageIdAndDeletedAtIsNull(String messageId);

    // 최신 N건 (anchor 없을 때)
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "ORDER BY m.createdAt DESC, m.messageId DESC")
    List<MessageEntity> findLatest(
            @Param("channelId") String channelId,
            org.springframework.data.domain.Pageable pageable
    );

    // anchor 이전 메시지 (before)
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "AND (m.createdAt < :anchorCreatedAt OR (m.createdAt = :anchorCreatedAt AND m.messageId < :anchorId)) " +
           "ORDER BY m.createdAt DESC, m.messageId DESC")
    List<MessageEntity> findBefore(
            @Param("channelId") String channelId,
            @Param("anchorCreatedAt") LocalDateTime anchorCreatedAt,
            @Param("anchorId") String anchorId,
            org.springframework.data.domain.Pageable pageable
    );

    // anchor 이후 메시지 (after)
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "AND (m.createdAt > :anchorCreatedAt OR (m.createdAt = :anchorCreatedAt AND m.messageId > :anchorId)) " +
           "ORDER BY m.createdAt ASC, m.messageId ASC")
    List<MessageEntity> findAfter(
            @Param("channelId") String channelId,
            @Param("anchorCreatedAt") LocalDateTime anchorCreatedAt,
            @Param("anchorId") String anchorId,
            org.springframework.data.domain.Pageable pageable
    );

    // 검색: 최신 N건
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "AND m.content LIKE %:keyword% " +
           "ORDER BY m.createdAt DESC, m.messageId DESC")
    List<MessageEntity> searchLatest(
            @Param("channelId") String channelId,
            @Param("keyword") String keyword,
            org.springframework.data.domain.Pageable pageable
    );

    // 검색: anchor 이전
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "AND m.content LIKE %:keyword% " +
           "AND (m.createdAt < :anchorCreatedAt OR (m.createdAt = :anchorCreatedAt AND m.messageId < :anchorId)) " +
           "ORDER BY m.createdAt DESC, m.messageId DESC")
    List<MessageEntity> searchBefore(
            @Param("channelId") String channelId,
            @Param("keyword") String keyword,
            @Param("anchorCreatedAt") LocalDateTime anchorCreatedAt,
            @Param("anchorId") String anchorId,
            org.springframework.data.domain.Pageable pageable
    );

    // 검색: anchor 이후
    @Query("SELECT m FROM MessageEntity m " +
           "WHERE m.channelId = :channelId AND m.deletedAt IS NULL " +
           "AND m.content LIKE %:keyword% " +
           "AND (m.createdAt > :anchorCreatedAt OR (m.createdAt = :anchorCreatedAt AND m.messageId > :anchorId)) " +
           "ORDER BY m.createdAt ASC, m.messageId ASC")
    List<MessageEntity> searchAfter(
            @Param("channelId") String channelId,
            @Param("keyword") String keyword,
            @Param("anchorCreatedAt") LocalDateTime anchorCreatedAt,
            @Param("anchorId") String anchorId,
            org.springframework.data.domain.Pageable pageable
    );
}
