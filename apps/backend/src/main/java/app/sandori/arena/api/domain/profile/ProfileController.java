package app.sandori.arena.api.domain.profile;

import app.sandori.arena.api.domain.profile.dtos.ProfileDto;
import app.sandori.arena.api.domain.profile.dtos.UpdateProfileDto;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import app.sandori.arena.api.security.JwtPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profiles")
@Tag(name = "프로필", description = "프로필 API")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Operation(summary = "기본 프로필 수정", description = "내 기본 프로필(orgId=null)의 name, avatarFileId 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PatchMapping("/me")
    public ResponseEntity<SingleApiResult<ProfileDto>> updateMyProfile(
            @CurrentUser JwtPayload jwt,
            @Valid @RequestBody UpdateProfileDto request
    ) {
        ProfileDto result = profileService.updateDefaultProfile(jwt.uid(), request);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }
}
