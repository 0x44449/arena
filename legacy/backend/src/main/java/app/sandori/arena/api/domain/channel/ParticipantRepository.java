package app.sandori.arena.api.domain.channel;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<ParticipantEntity, ParticipantId> {

    @EntityGraph(attributePaths = {"channel"})
    List<ParticipantEntity> findByUserIdAndDeletedAtIsNull(String userId);

    Optional<ParticipantEntity> findByChannelIdAndUserIdAndDeletedAtIsNull(String channelId, String userId);

    @EntityGraph(attributePaths = {"user", "user.avatar"})
    List<ParticipantEntity> findByChannelIdAndDeletedAtIsNull(String channelId);
}
