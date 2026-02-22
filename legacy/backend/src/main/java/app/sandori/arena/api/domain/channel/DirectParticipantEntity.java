package app.sandori.arena.api.domain.channel;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "direct_participants")
@IdClass(ParticipantId.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DirectParticipantEntity {

    @Id
    private String channelId;

    @Id
    private String userId;

    public DirectParticipantEntity(String channelId, String userId) {
        this.channelId = channelId;
        this.userId = userId;
    }
}
