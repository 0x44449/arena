package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "orgs")
public class OrgEntity {

    @Id
    @Column(name = "orgId")
    private String orgId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "avatarFileId")
    private String avatarFileId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected OrgEntity() {
    }

    public OrgEntity(String name, String description) {
        this.orgId = IdGenerator.generate();
        this.name = name;
        this.description = description;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getOrgId() { return orgId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getAvatarFileId() { return avatarFileId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void changeName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }

    public void changeDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void changeAvatarFileId(String avatarFileId) {
        this.avatarFileId = avatarFileId;
        this.updatedAt = LocalDateTime.now();
    }
}
