package app.sandori.arena.api.domain.device;

import app.sandori.arena.api.domain.device.dtos.RegisterDeviceRequest;
import app.sandori.arena.api.domain.device.dtos.UnregisterDeviceRequest;
import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.global.dto.ApiResult;
import app.sandori.arena.api.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "devices")
@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("register")
    @RequireSession
    @Operation(summary = "디바이스 등록", operationId = "registerDevice")
    public ApiResult registerDevice(
            @CurrentUser CachedUser user,
            @RequestBody RegisterDeviceRequest request) {
        deviceService.registerDevice(user.userId(), request);
        return ApiResult.success();
    }

    @PostMapping("unregister")
    @RequireSession
    @Operation(summary = "디바이스 해제", operationId = "unregisterDevice")
    public ApiResult unregisterDevice(@RequestBody UnregisterDeviceRequest request) {
        deviceService.unregisterDevice(request);
        return ApiResult.success();
    }
}
