package app.sandori.arena.api.domain.team;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<TeamEntity, String> {

    List<TeamEntity> findAllByOrgIdAndDeletedAtIsNull(String orgId);

    Optional<TeamEntity> findByTeamIdAndDeletedAtIsNull(String teamId);
}
