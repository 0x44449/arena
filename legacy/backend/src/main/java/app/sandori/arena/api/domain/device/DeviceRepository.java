package app.sandori.arena.api.domain.device;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<DeviceEntity, String> {

    Optional<DeviceEntity> findByDeviceIdAndDeletedAtIsNull(String deviceId);
}
