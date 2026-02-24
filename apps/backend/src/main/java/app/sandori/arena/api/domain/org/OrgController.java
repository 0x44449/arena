package app.sandori.arena.api.domain.org;

import app.sandori.arena.api.domain.org.dtos.CreateOrgDto;
import app.sandori.arena.api.domain.org.dtos.InviteCodeDto;
import app.sandori.arena.api.domain.org.dtos.JoinOrgDto;
import app.sandori.arena.api.domain.org.dtos.OrgDto;
import app.sandori.arena.api.domain.org.dtos.UpdateOrgDto;
import app.sandori.arena.api.domain.profile.dtos.ProfileDto;
import app.sandori.arena.api.global.dto.ApiResult;
import app.sandori.arena.api.global.dto.ListApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import app.sandori.arena.api.security.JwtPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orgs")
@Tag(name = "조직", description = "Org 관리 API")
public class OrgController {

    private final OrgService orgService;

    public OrgController(OrgService orgService) {
        this.orgService = orgService;
    }

    @Operation(summary = "Org 생성", description = "조직을 생성하고 생성자가 OWNER가 된다")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    @PostMapping
    public ResponseEntity<SingleApiResult<OrgDto>> createOrg(
            @CurrentUser JwtPayload jwt,
            @Valid @RequestBody CreateOrgDto request
    ) {
        OrgDto result = orgService.createOrg(jwt.uid(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "내 Org 목록", description = "내가 속한 조직 목록 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<ListApiResult<OrgDto>> getMyOrgs(
            @CurrentUser JwtPayload jwt
    ) {
        List<OrgDto> result = orgService.getMyOrgs(jwt.uid());
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "초대 코드로 Org 가입")
    @ApiResponse(responseCode = "201", description = "가입 성공")
    @PostMapping("/join")
    public ResponseEntity<SingleApiResult<OrgDto>> joinOrg(
            @CurrentUser JwtPayload jwt,
            @Valid @RequestBody JoinOrgDto request
    ) {
        OrgDto result = orgService.joinOrg(jwt.uid(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "Org 상세 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{orgId}")
    public ResponseEntity<SingleApiResult<OrgDto>> getOrg(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        OrgDto result = orgService.getOrg(jwt.uid(), orgId);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "Org 수정", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PatchMapping("/{orgId}")
    public ResponseEntity<SingleApiResult<OrgDto>> updateOrg(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Valid @RequestBody UpdateOrgDto request
    ) {
        OrgDto result = orgService.updateOrg(jwt.uid(), orgId, request);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "Org 탈퇴", description = "OWNER는 탈퇴 불가")
    @ApiResponse(responseCode = "200", description = "탈퇴 성공")
    @PostMapping("/{orgId}/leave")
    public ResponseEntity<ApiResult> leaveOrg(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        orgService.leaveOrg(jwt.uid(), orgId);
        return ResponseEntity.ok(ApiResult.success());
    }

    @Operation(summary = "Org 멤버 목록", description = "Org에 속한 프로필 목록")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{orgId}/members")
    public ResponseEntity<ListApiResult<ProfileDto>> getMembers(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        List<ProfileDto> result = orgService.getMembers(jwt.uid(), orgId);
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "Org 멤버 추방", description = "OWNER만 가능. 자신은 추방 불가")
    @ApiResponse(responseCode = "200", description = "추방 성공")
    @DeleteMapping("/{orgId}/members/{profileId}")
    public ResponseEntity<ApiResult> removeMember(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "프로필 ID") @PathVariable String profileId
    ) {
        orgService.removeMember(jwt.uid(), orgId, profileId);
        return ResponseEntity.ok(ApiResult.success());
    }

    @Operation(summary = "초대 코드 생성", description = "OWNER만 가능")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    @PostMapping("/{orgId}/invite-codes")
    public ResponseEntity<SingleApiResult<InviteCodeDto>> createInviteCode(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        InviteCodeDto result = orgService.createInviteCode(jwt.uid(), orgId);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "초대 코드 목록", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{orgId}/invite-codes")
    public ResponseEntity<ListApiResult<InviteCodeDto>> getInviteCodes(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        List<InviteCodeDto> result = orgService.getInviteCodes(jwt.uid(), orgId);
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "초대 코드 삭제", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{orgId}/invite-codes/{inviteCodeId}")
    public ResponseEntity<ApiResult> deleteInviteCode(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "초대 코드 ID") @PathVariable String inviteCodeId
    ) {
        orgService.deleteInviteCode(jwt.uid(), orgId, inviteCodeId);
        return ResponseEntity.ok(ApiResult.success());
    }
}
