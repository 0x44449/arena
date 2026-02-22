package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.file.FileEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group_channels")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupChannelEntity {

    @Id
    private String channelId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId", referencedColumnName = "channelId", insertable = false, updatable = false)
    private ChannelEntity channel;

    @Column
    private String iconFileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iconFileId", referencedColumnName = "fileId", insertable = false, updatable = false)
    private FileEntity icon;

    public GroupChannelEntity(String channelId, String iconFileId) {
        this.channelId = channelId;
        this.iconFileId = iconFileId;
    }
}
