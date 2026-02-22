package app.sandori.arena.api.domain.device;

import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "devices", indexes = {
        @Index(name = "idx_devices_user_id", columnList = "userId")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeviceEntity extends BaseTimeEntity {

    @Id
    private String deviceId;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false, columnDefinition = "text")
    private String fcmToken;

    @Column(nullable = false, length = 20)
    private String platform;

    @Column(length = 100)
    private String deviceModel;

    @Column(length = 50)
    private String osVersion;

    public DeviceEntity(String deviceId, String userId, String fcmToken,
                        String platform, String deviceModel, String osVersion) {
        this.deviceId = deviceId;
        this.userId = userId;
        this.fcmToken = fcmToken;
        this.platform = platform;
        this.deviceModel = deviceModel;
        this.osVersion = osVersion;
    }
}
