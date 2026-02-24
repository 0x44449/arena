package app.sandori.arena.api.domain.team;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
public class TeamMemberEntity {

    @Id
    @Column(name = "teamMemberId")
    private String teamMemberId;

    @Column(name = "teamId", nullable = false)
    private String teamId;

    @Column(name = "profileId", nullable = false)
    private String profileId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected TeamMemberEntity() {
    }

    public TeamMemberEntity(String teamId, String profileId) {
        this.teamMemberId = IdGenerator.generate();
        this.teamId = teamId;
        this.profileId = profileId;
        this.createdAt = LocalDateTime.now();
    }

    public String getTeamMemberId() { return teamMemberId; }
    public String getTeamId() { return teamId; }
    public String getProfileId() { return profileId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
