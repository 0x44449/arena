package app.sandori.arena.api.domain.profile;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<ProfileEntity, String> {

    Optional<ProfileEntity> findByUserIdAndOrgIdIsNullAndDeletedAtIsNull(String userId);
}
