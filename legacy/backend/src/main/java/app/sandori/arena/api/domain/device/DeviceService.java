package app.sandori.arena.api.domain.device;

import app.sandori.arena.api.domain.device.dtos.RegisterDeviceRequest;
import app.sandori.arena.api.domain.device.dtos.UnregisterDeviceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    @Transactional
    public void registerDevice(String userId, RegisterDeviceRequest dto) {
        DeviceEntity device = deviceRepository.findById(dto.getDeviceId()).orElse(null);

        if (device != null) {
            device.setUserId(userId);
            device.setFcmToken(dto.getFcmToken());
            device.setPlatform(dto.getPlatform());
            device.setDeviceModel(dto.getDeviceModel());
            device.setOsVersion(dto.getOsVersion());
        } else {
            device = new DeviceEntity(
                    dto.getDeviceId(),
                    userId,
                    dto.getFcmToken(),
                    dto.getPlatform(),
                    dto.getDeviceModel(),
                    dto.getOsVersion()
            );
        }

        deviceRepository.save(device);
    }

    @Transactional
    public void unregisterDevice(UnregisterDeviceRequest dto) {
        deviceRepository.findByDeviceIdAndDeletedAtIsNull(dto.getDeviceId())
                .ifPresent(device -> {
                    device.softDelete();
                    deviceRepository.save(device);
                });
    }
}
