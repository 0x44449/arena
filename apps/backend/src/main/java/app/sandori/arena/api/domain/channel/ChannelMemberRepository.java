package app.sandori.arena.api.domain.channel;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelMemberRepository extends JpaRepository<ChannelMemberEntity, String> {

    List<ChannelMemberEntity> findAllByChannelIdAndDeletedAtIsNull(String channelId);

    List<ChannelMemberEntity> findAllByUserIdAndDeletedAtIsNull(String userId);

    Optional<ChannelMemberEntity> findByChannelIdAndUserIdAndDeletedAtIsNull(String channelId, String userId);

    boolean existsByChannelIdAndUserIdAndDeletedAtIsNull(String channelId, String userId);
}
