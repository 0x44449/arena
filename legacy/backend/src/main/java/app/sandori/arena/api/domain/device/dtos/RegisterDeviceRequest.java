package app.sandori.arena.api.domain.device.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDeviceRequest {

    private String deviceId;
    private String fcmToken;
    private String platform;
    private String deviceModel;
    private String osVersion;
}
