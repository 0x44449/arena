package app.sandori.arena.api.domain.channel;

import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupChannelRepository extends JpaRepository<GroupChannelEntity, String> {

    @EntityGraph(attributePaths = {"icon"})
    Optional<GroupChannelEntity> findByChannelId(String channelId);
}
