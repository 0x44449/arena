package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "participants", indexes = {
        @Index(name = "idx_participants_user_id", columnList = "userId")
})
@IdClass(ParticipantId.class)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ParticipantEntity extends BaseTimeEntity {

    @Id
    private String channelId;

    @Id
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId", referencedColumnName = "channelId", insertable = false, updatable = false)
    private ChannelEntity channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId", insertable = false, updatable = false)
    private UserEntity user;

    @Column
    private LocalDateTime lastReadAt;

    public ParticipantEntity(String channelId, String userId, LocalDateTime lastReadAt) {
        this.channelId = channelId;
        this.userId = userId;
        this.lastReadAt = lastReadAt;
    }
}
