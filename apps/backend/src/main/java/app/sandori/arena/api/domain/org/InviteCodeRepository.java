package app.sandori.arena.api.domain.org;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteCodeRepository extends JpaRepository<InviteCodeEntity, String> {

    Optional<InviteCodeEntity> findByCodeAndDeletedAtIsNull(String code);

    Optional<InviteCodeEntity> findByInviteCodeIdAndDeletedAtIsNull(String inviteCodeId);

    List<InviteCodeEntity> findAllByOrgIdAndDeletedAtIsNull(String orgId);
}
