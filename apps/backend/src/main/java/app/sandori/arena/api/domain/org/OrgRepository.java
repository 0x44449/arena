package app.sandori.arena.api.domain.org;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgRepository extends JpaRepository<OrgEntity, String> {

    Optional<OrgEntity> findByOrgIdAndDeletedAtIsNull(String orgId);
}
