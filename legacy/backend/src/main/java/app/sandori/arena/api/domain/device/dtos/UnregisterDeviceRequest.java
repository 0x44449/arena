package app.sandori.arena.api.domain.device.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnregisterDeviceRequest {

    private String deviceId;
}
