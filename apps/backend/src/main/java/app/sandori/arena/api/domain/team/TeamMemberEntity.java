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

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected TeamMemberEntity() {
    }

    public TeamMemberEntity(String teamId, String userId) {
        this.teamMemberId = IdGenerator.generate();
        this.teamId = teamId;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    public String getTeamMemberId() { return teamMemberId; }
    public String getTeamId() { return teamId; }
    public String getUserId() { return userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
