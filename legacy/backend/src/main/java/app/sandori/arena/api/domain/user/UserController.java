package app.sandori.arena.api.domain.user;

import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.domain.user.dtos.CreateUserRequest;
import app.sandori.arena.api.domain.user.dtos.UpdateUserRequest;
import app.sandori.arena.api.domain.user.dtos.UserResponse;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import app.sandori.arena.api.security.JwtPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "users")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", operationId = "getMe")
    public SingleApiResult<UserResponse> getMe(@CurrentUser JwtPayload jwt) {
        UserEntity entity = userService.findByUid(jwt.uid());
        if (entity == null) {
            return SingleApiResult.of(null);
        }
        return SingleApiResult.of(UserResponse.from(entity));
    }

    @GetMapping("/{userId}")
    @RequireSession
    @Operation(summary = "유저 조회", operationId = "getUser")
    public SingleApiResult<UserResponse> getUser(@PathVariable String userId) {
        UserEntity entity = userService.getByUserId(userId);
        return SingleApiResult.of(UserResponse.from(entity));
    }

    @PatchMapping("/me")
    @RequireSession
    @Operation(summary = "내 정보 수정", operationId = "updateMe")
    public SingleApiResult<UserResponse> updateMe(
            @CurrentUser CachedUser user,
            @RequestBody UpdateUserRequest request) {
        UserEntity entity = userService.update(user.userId(), request);
        return SingleApiResult.of(UserResponse.from(entity));
    }

    @PostMapping
    @Operation(summary = "회원가입", operationId = "createUser")
    public SingleApiResult<UserResponse> createUser(
            @CurrentUser JwtPayload jwt,
            @RequestBody CreateUserRequest request) {
        UserEntity entity = userService.create(jwt.uid(), request);
        return SingleApiResult.of(UserResponse.from(entity));
    }
}
