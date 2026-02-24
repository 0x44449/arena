package app.sandori.arena.api.domain.channel;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelMemberRepository extends JpaRepository<ChannelMemberEntity, ChannelMemberId> {

    List<ChannelMemberEntity> findAllByChannelId(String channelId);

    List<ChannelMemberEntity> findAllByProfileId(String profileId);

    Optional<ChannelMemberEntity> findByChannelIdAndProfileId(String channelId, String profileId);

    boolean existsByChannelIdAndProfileId(String channelId, String profileId);
}
