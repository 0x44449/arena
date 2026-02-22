package app.sandori.arena.api.domain.channel;

import java.io.Serializable;
import java.util.Objects;

public class ParticipantId implements Serializable {

    private String channelId;
    private String userId;

    public ParticipantId() {
    }

    public ParticipantId(String channelId, String userId) {
        this.channelId = channelId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipantId that = (ParticipantId) o;
        return Objects.equals(channelId, that.channelId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(channelId, userId);
    }
}
