package app.sandori.arena.api.domain.team;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, String> {

    List<TeamMemberEntity> findAllByTeamIdAndDeletedAtIsNull(String teamId);

    Optional<TeamMemberEntity> findByTeamMemberIdAndDeletedAtIsNull(String teamMemberId);

    boolean existsByTeamIdAndUserIdAndDeletedAtIsNull(String teamId, String userId);
}
