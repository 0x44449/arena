package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Entity
@Table(name = "invite_codes")
public class InviteCodeEntity {

    // 혼동되는 문자 제외 (0/O, 1/I)
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Id
    @Column(name = "inviteCodeId")
    private String inviteCodeId;

    @Column(name = "orgId", nullable = false)
    private String orgId;

    @Column(name = "code", nullable = false, length = 8)
    private String code;

    @Column(name = "creatorId", nullable = false)
    private String creatorId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected InviteCodeEntity() {
    }

    public InviteCodeEntity(String orgId, String creatorId) {
        this.inviteCodeId = IdGenerator.generate();
        this.orgId = orgId;
        this.code = generateCode();
        this.creatorId = creatorId;
        this.createdAt = LocalDateTime.now();
    }

    private static String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    public String getInviteCodeId() { return inviteCodeId; }
    public String getOrgId() { return orgId; }
    public String getCode() { return code; }
    public String getCreatedByProfileId() { return creatorId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
