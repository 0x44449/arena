package app.sandori.arena.api.domain.team;

import app.sandori.arena.api.domain.team.dtos.AddTeamMemberDto;
import app.sandori.arena.api.domain.team.dtos.CreateTeamDto;
import app.sandori.arena.api.domain.team.dtos.TeamDto;
import app.sandori.arena.api.domain.team.dtos.TeamMemberDto;
import app.sandori.arena.api.domain.team.dtos.UpdateTeamDto;
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
@RequestMapping("/api/v1/orgs/{orgId}/teams")
@Tag(name = "팀", description = "Team 관리 API")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @Operation(summary = "Team 생성", description = "OWNER만 가능")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    @PostMapping
    public ResponseEntity<SingleApiResult<TeamDto>> createTeam(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Valid @RequestBody CreateTeamDto request
    ) {
        TeamDto result = teamService.createTeam(jwt.uid(), orgId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "Team 목록", description = "Org 내 팀 목록 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<ListApiResult<TeamDto>> getTeams(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        List<TeamDto> result = teamService.getTeams(jwt.uid(), orgId);
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "Team 상세 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{teamId}")
    public ResponseEntity<SingleApiResult<TeamDto>> getTeam(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId
    ) {
        TeamDto result = teamService.getTeam(jwt.uid(), orgId, teamId);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "Team 수정", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PatchMapping("/{teamId}")
    public ResponseEntity<SingleApiResult<TeamDto>> updateTeam(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId,
            @Valid @RequestBody UpdateTeamDto request
    ) {
        TeamDto result = teamService.updateTeam(jwt.uid(), orgId, teamId, request);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "Team 삭제", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{teamId}")
    public ResponseEntity<ApiResult> deleteTeam(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId
    ) {
        teamService.deleteTeam(jwt.uid(), orgId, teamId);
        return ResponseEntity.ok(ApiResult.success());
    }

    @Operation(summary = "Team 멤버 추가", description = "OWNER만 가능. Org 멤버만 추가 가능")
    @ApiResponse(responseCode = "201", description = "추가 성공")
    @PostMapping("/{teamId}/members")
    public ResponseEntity<SingleApiResult<TeamMemberDto>> addMember(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId,
            @Valid @RequestBody AddTeamMemberDto request
    ) {
        TeamMemberDto result = teamService.addMember(jwt.uid(), orgId, teamId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "Team 멤버 목록")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{teamId}/members")
    public ResponseEntity<ListApiResult<TeamMemberDto>> getMembers(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId
    ) {
        List<TeamMemberDto> result = teamService.getMembers(jwt.uid(), orgId, teamId);
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "Team 멤버 제거", description = "OWNER만 가능")
    @ApiResponse(responseCode = "200", description = "제거 성공")
    @DeleteMapping("/{teamId}/members/{profileId}")
    public ResponseEntity<ApiResult> removeMember(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "Team ID") @PathVariable String teamId,
            @Parameter(description = "프로필 ID") @PathVariable String profileId
    ) {
        teamService.removeMember(jwt.uid(), orgId, teamId, profileId);
        return ResponseEntity.ok(ApiResult.success());
    }
}
