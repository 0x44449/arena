package app.sandori.arena.api.domain.contact;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<ContactEntity, ContactId> {

    @EntityGraph(attributePaths = {"user", "user.avatar"})
    List<ContactEntity> findByOwnerIdAndDeletedAtIsNullOrderByCreatedAtDesc(String ownerId);

    Optional<ContactEntity> findByOwnerIdAndUserId(String ownerId, String userId);

    @EntityGraph(attributePaths = {"user", "user.avatar"})
    Optional<ContactEntity> findByOwnerIdAndUserIdAndDeletedAtIsNull(String ownerId, String userId);
}
