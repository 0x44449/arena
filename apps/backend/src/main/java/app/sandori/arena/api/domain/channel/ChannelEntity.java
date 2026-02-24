package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "channels")
public class ChannelEntity {

    public static final String TYPE_DM = "DM";
    public static final String TYPE_GROUP = "GROUP";

    @Id
    @Column(name = "channelId")
    private String channelId;

    @Column(name = "orgId", nullable = false)
    private String orgId;

    @Column(name = "type", nullable = false, length = 10)
    private String type;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "createdByProfileId")
    private String createdByProfileId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

    protected ChannelEntity() {
    }

    public ChannelEntity(String orgId, String type, String name, String createdByProfileId) {
        this.channelId = IdGenerator.generate();
        this.orgId = orgId;
        this.type = type;
        this.name = name;
        this.createdByProfileId = createdByProfileId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getChannelId() { return channelId; }
    public String getOrgId() { return orgId; }
    public String getType() { return type; }
    public String getName() { return name; }
    public String getCreatedByProfileId() { return createdByProfileId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}
