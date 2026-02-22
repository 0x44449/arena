package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "channels")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChannelEntity extends BaseTimeEntity {

    @Id
    private String channelId;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(length = 100)
    private String name;

    @Column
    private String teamId;

    @Column
    private LocalDateTime lastMessageAt;

    @Builder
    public ChannelEntity(String channelId, String type, String name,
                         String teamId, LocalDateTime lastMessageAt) {
        this.channelId = channelId;
        this.type = type;
        this.name = name;
        this.teamId = teamId;
        this.lastMessageAt = lastMessageAt;
    }
}
