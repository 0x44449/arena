package app.sandori.arena.api.domain.file;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, String> {

    Optional<FileEntity> findByFileIdAndDeletedAtIsNull(String fileId);
}
