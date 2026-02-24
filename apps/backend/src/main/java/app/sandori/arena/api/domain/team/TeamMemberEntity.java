package app.sandori.arena.api.domain.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
@IdClass(TeamMemberId.class)
public class TeamMemberEntity {

    @Id
    @Column(name = "teamId")
    private String teamId;

    @Id
    @Column(name = "profileId")
    private String profileId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected TeamMemberEntity() {
    }

    public TeamMemberEntity(String teamId, String profileId) {
        this.teamId = teamId;
        this.profileId = profileId;
        this.createdAt = LocalDateTime.now();
    }

    public String getTeamId() { return teamId; }
    public String getProfileId() { return profileId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
