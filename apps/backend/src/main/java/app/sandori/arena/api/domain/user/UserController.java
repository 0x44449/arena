package app.sandori.arena.api.domain.user;

import app.sandori.arena.api.domain.user.dtos.CreateUserDto;
import app.sandori.arena.api.domain.user.dtos.UserWithProfileDto;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import app.sandori.arena.api.security.JwtPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "사용자", description = "사용자 계정 API")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "회원가입", description = "User 생성 + 기본 프로필 생성")
    @ApiResponse(responseCode = "201", description = "가입 성공")
    @PostMapping
    public ResponseEntity<SingleApiResult<UserWithProfileDto>> createUser(
            @CurrentUser JwtPayload jwt,
            @Valid @RequestBody CreateUserDto request
    ) {
        UserWithProfileDto result = userService.createUser(jwt.uid(), jwt.email(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "내 정보 조회", description = "내 계정 + 기본 프로필 조회. 미가입이면 data: null")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/me")
    public ResponseEntity<SingleApiResult<UserWithProfileDto>> getMe(
            @CurrentUser JwtPayload jwt
    ) {
        UserWithProfileDto result = userService.getMe(jwt.uid());
        return ResponseEntity.ok(SingleApiResult.of(result));
    }
}
