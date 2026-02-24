package app.sandori.arena.api.domain.profile;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
public class ProfileEntity {

    @Id
    @Column(name = "profileId")
    private String profileId;

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "orgId")
    private String orgId;

    @Column(name = "name", nullable = false, length = 32)
    private String name;

    @Column(name = "avatarFileId")
    private String avatarFileId;

    @Column(name = "role", length = 20)
    private String role;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected ProfileEntity() {
    }

    public ProfileEntity(String userId, String orgId, String name) {
        this.profileId = IdGenerator.generate();
        this.userId = userId;
        this.orgId = orgId;
        this.name = name;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getProfileId() { return profileId; }
    public String getUserId() { return userId; }
    public String getOrgId() { return orgId; }
    public String getName() { return name; }
    public String getAvatarFileId() { return avatarFileId; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void changeName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }

    public void changeAvatarFileId(String avatarFileId) {
        this.avatarFileId = avatarFileId;
        this.updatedAt = LocalDateTime.now();
    }
}
