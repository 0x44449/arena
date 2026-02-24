package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "org_members")
public class OrgMemberEntity {

    public static final String ROLE_OWNER = "OWNER";
    public static final String ROLE_USER = "USER";

    @Id
    @Column(name = "orgMemberId")
    private String orgMemberId;

    @Column(name = "orgId", nullable = false)
    private String orgId;

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "role", nullable = false, length = 20)
    private String role;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected OrgMemberEntity() {
    }

    public OrgMemberEntity(String orgId, String userId, String role) {
        this.orgMemberId = IdGenerator.generate();
        this.orgId = orgId;
        this.userId = userId;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getOrgMemberId() { return orgMemberId; }
    public String getOrgId() { return orgId; }
    public String getUserId() { return userId; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
