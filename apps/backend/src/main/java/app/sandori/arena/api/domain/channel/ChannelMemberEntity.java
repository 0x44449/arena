package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "channel_members")
public class ChannelMemberEntity {

    @Id
    @Column(name = "channelMemberId")
    private String channelMemberId;

    @Column(name = "channelId", nullable = false)
    private String channelId;

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "lastReadMessageId")
    private String lastReadMessageId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected ChannelMemberEntity() {
    }

    public ChannelMemberEntity(String channelId, String userId) {
        this.channelMemberId = IdGenerator.generate();
        this.channelId = channelId;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    public String getChannelMemberId() { return channelMemberId; }
    public String getChannelId() { return channelId; }
    public String getUserId() { return userId; }
    public String getLastReadMessageId() { return lastReadMessageId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
