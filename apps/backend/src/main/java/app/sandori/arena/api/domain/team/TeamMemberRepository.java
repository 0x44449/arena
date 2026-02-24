package app.sandori.arena.api.domain.team;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, TeamMemberId> {

    List<TeamMemberEntity> findAllByTeamId(String teamId);

    boolean existsByTeamIdAndProfileId(String teamId, String profileId);
}
