package app.sandori.arena.api.domain.channel;

import java.io.Serializable;
import java.util.Objects;

public class ChannelMemberId implements Serializable {

    private String channelId;
    private String profileId;

    public ChannelMemberId() {
    }

    public ChannelMemberId(String channelId, String profileId) {
        this.channelId = channelId;
        this.profileId = profileId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChannelMemberId that)) return false;
        return Objects.equals(channelId, that.channelId) && Objects.equals(profileId, that.profileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(channelId, profileId);
    }
}
