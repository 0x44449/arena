package app.sandori.arena.api.domain.channel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "channel_members")
@IdClass(ChannelMemberId.class)
public class ChannelMemberEntity {

    @Id
    @Column(name = "channelId")
    private String channelId;

    @Id
    @Column(name = "profileId")
    private String profileId;

    @Column(name = "lastReadMessageId")
    private String lastReadMessageId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected ChannelMemberEntity() {
    }

    public ChannelMemberEntity(String channelId, String profileId) {
        this.channelId = channelId;
        this.profileId = profileId;
        this.createdAt = LocalDateTime.now();
    }

    public String getChannelId() { return channelId; }
    public String getProfileId() { return profileId; }
    public String getLastReadMessageId() { return lastReadMessageId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
