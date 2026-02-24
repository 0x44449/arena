package app.sandori.arena.api.domain.team;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "teams")
public class TeamEntity {

    @Id
    @Column(name = "teamId")
    private String teamId;

    @Column(name = "orgId", nullable = false)
    private String orgId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected TeamEntity() {
    }

    public TeamEntity(String orgId, String name) {
        this.teamId = IdGenerator.generate();
        this.orgId = orgId;
        this.name = name;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getTeamId() { return teamId; }
    public String getOrgId() { return orgId; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void changeName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
