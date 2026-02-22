package app.sandori.arena.api.domain.channel;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "direct_channels")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DirectChannelEntity {

    @Id
    private String channelId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId", referencedColumnName = "channelId", insertable = false, updatable = false)
    private ChannelEntity channel;

    public DirectChannelEntity(String channelId) {
        this.channelId = channelId;
    }
}
