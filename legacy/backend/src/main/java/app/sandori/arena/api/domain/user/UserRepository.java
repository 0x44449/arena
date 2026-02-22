package app.sandori.arena.api.domain.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {

    @EntityGraph(attributePaths = {"avatar"})
    Optional<UserEntity> findByUidAndDeletedAtIsNull(String uid);

    @EntityGraph(attributePaths = {"avatar"})
    Optional<UserEntity> findByUserIdAndDeletedAtIsNull(String userId);

    boolean existsByUtag(String utag);
}
