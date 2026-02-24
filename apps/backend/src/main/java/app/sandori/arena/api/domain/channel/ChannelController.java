package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.channel.dtos.ChannelDto;
import app.sandori.arena.api.domain.channel.dtos.CreateDmDto;
import app.sandori.arena.api.domain.channel.dtos.CreateGroupDto;
import app.sandori.arena.api.domain.channel.dtos.InviteMembersDto;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orgs/{orgId}/channels")
@Tag(name = "대화방", description = "DM/그룹 대화방 API")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @Operation(summary = "DM 생성", description = "1:1 DM 생성. 기존 DM이 있으면 기존 것을 반환")
    @ApiResponse(responseCode = "201", description = "생성/조회 성공")
    @PostMapping("/dm")
    public ResponseEntity<SingleApiResult<ChannelDto>> createDm(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Valid @RequestBody CreateDmDto request
    ) {
        ChannelDto result = channelService.createDm(jwt.uid(), orgId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "그룹 채팅 생성")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    @PostMapping("/group")
    public ResponseEntity<SingleApiResult<ChannelDto>> createGroup(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Valid @RequestBody CreateGroupDto request
    ) {
        ChannelDto result = channelService.createGroup(jwt.uid(), orgId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "내 대화방 목록", description = "내가 속한 대화방 목록 (해당 Org)")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<ListApiResult<ChannelDto>> getMyChannels(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId
    ) {
        List<ChannelDto> result = channelService.getMyChannels(jwt.uid(), orgId);
        return ResponseEntity.ok(ListApiResult.of(result));
    }

    @Operation(summary = "대화방 상세", description = "멤버 목록 포함")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{channelId}")
    public ResponseEntity<SingleApiResult<ChannelDto>> getChannel(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId
    ) {
        ChannelDto result = channelService.getChannel(jwt.uid(), orgId, channelId);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "멤버 초대", description = "그룹 채팅에만 가능. Org 멤버만 초대 가능")
    @ApiResponse(responseCode = "200", description = "초대 성공")
    @PostMapping("/{channelId}/invite")
    public ResponseEntity<SingleApiResult<ChannelDto>> inviteMembers(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId,
            @Valid @RequestBody InviteMembersDto request
    ) {
        ChannelDto result = channelService.inviteMembers(jwt.uid(), orgId, channelId, request);
        return ResponseEntity.ok(SingleApiResult.of(result));
    }

    @Operation(summary = "대화방 나가기", description = "그룹 채팅에서만 가능. DM은 나갈 수 없음")
    @ApiResponse(responseCode = "200", description = "나가기 성공")
    @PostMapping("/{channelId}/leave")
    public ResponseEntity<ApiResult> leaveChannel(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId
    ) {
        channelService.leaveChannel(jwt.uid(), orgId, channelId);
        return ResponseEntity.ok(ApiResult.success());
    }
}
