package app.sandori.arena.api.domain.profile;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<ProfileEntity, String> {

    Optional<ProfileEntity> findByProfileIdAndDeletedAtIsNull(String profileId);

    Optional<ProfileEntity> findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(String userId);

    Optional<ProfileEntity> findByUserIdAndOrgIdAndDeletedAtIsNull(String userId, String orgId);

    List<ProfileEntity> findAllByUserIdAndOrgIdIsNotNullAndDeletedAtIsNull(String userId);

    List<ProfileEntity> findAllByOrgIdAndDeletedAtIsNull(String orgId);

    boolean existsByUserIdAndOrgIdAndDeletedAtIsNull(String userId, String orgId);
}
