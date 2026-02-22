package app.sandori.arena.api.domain.channel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group_participants")
@IdClass(ParticipantId.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupParticipantEntity {

    @Id
    private String channelId;

    @Id
    private String userId;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(length = 32)
    private String nickname;

    public GroupParticipantEntity(String channelId, String userId, String role, String nickname) {
        this.channelId = channelId;
        this.userId = userId;
        this.role = role;
        this.nickname = nickname;
    }
}
