package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id
    @Column(name = "messageId")
    private String messageId;

    @Column(name = "channelId", nullable = false)
    private String channelId;

    @Column(name = "senderId", nullable = false)
    private String senderId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected MessageEntity() {
    }

    public MessageEntity(String channelId, String senderId, String content) {
        this.messageId = IdGenerator.generate();
        this.channelId = channelId;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public String getMessageId() { return messageId; }
    public String getChannelId() { return channelId; }
    public String getSenderId() { return senderId; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}
