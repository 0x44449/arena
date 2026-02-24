package app.sandori.arena.api.domain.org;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgMemberRepository extends JpaRepository<OrgMemberEntity, String> {

    List<OrgMemberEntity> findAllByUserIdAndDeletedAtIsNull(String userId);

    List<OrgMemberEntity> findAllByOrgIdAndDeletedAtIsNull(String orgId);

    Optional<OrgMemberEntity> findByOrgIdAndUserIdAndDeletedAtIsNull(String orgId, String userId);

    Optional<OrgMemberEntity> findByOrgMemberIdAndDeletedAtIsNull(String orgMemberId);

    boolean existsByOrgIdAndUserIdAndDeletedAtIsNull(String orgId, String userId);
}
