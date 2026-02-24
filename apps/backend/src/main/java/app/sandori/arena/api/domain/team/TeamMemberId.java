package app.sandori.arena.api.domain.team;

import java.io.Serializable;
import java.util.Objects;

public class TeamMemberId implements Serializable {

    private String teamId;
    private String profileId;

    public TeamMemberId() {
    }

    public TeamMemberId(String teamId, String profileId) {
        this.teamId = teamId;
        this.profileId = profileId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeamMemberId that)) return false;
        return Objects.equals(teamId, that.teamId) && Objects.equals(profileId, that.profileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teamId, profileId);
    }
}
