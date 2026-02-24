package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.domain.message.dtos.MessageDto;
import app.sandori.arena.api.domain.message.dtos.SendMessageDto;
import app.sandori.arena.api.global.dto.ApiResult;
import app.sandori.arena.api.global.dto.InfinityListApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import app.sandori.arena.api.security.JwtPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orgs/{orgId}/channels/{channelId}/messages")
@Tag(name = "메시지", description = "메시지 CRUD API")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @Operation(summary = "메시지 전송")
    @ApiResponse(responseCode = "201", description = "전송 성공")
    @PostMapping
    public ResponseEntity<SingleApiResult<MessageDto>> sendMessage(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId,
            @Valid @RequestBody SendMessageDto request
    ) {
        MessageDto result = messageService.sendMessage(jwt.uid(), orgId, channelId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SingleApiResult.of(result));
    }

    @Operation(summary = "메시지 목록", description = "커서 기반 양방향 페이지네이션")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<InfinityListApiResult<MessageDto>> getMessages(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId,
            @Parameter(description = "기준 메시지 ID (없으면 최신)") @RequestParam(required = false) String anchor,
            @Parameter(description = "anchor 이전 메시지 수") @RequestParam(defaultValue = "30") int before,
            @Parameter(description = "anchor 이후 메시지 수") @RequestParam(defaultValue = "0") int after
    ) {
        InfinityListApiResult<MessageDto> result = messageService.getMessages(
                jwt.uid(), orgId, channelId, anchor, before, after);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "메시지 삭제", description = "본인 메시지만 삭제 가능 (soft delete)")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResult> deleteMessage(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId,
            @Parameter(description = "메시지 ID") @PathVariable String messageId
    ) {
        messageService.deleteMessage(jwt.uid(), orgId, channelId, messageId);
        return ResponseEntity.ok(ApiResult.success());
    }

    @Operation(summary = "메시지 검색", description = "채널 내 키워드 검색 + 커서 페이지네이션")
    @ApiResponse(responseCode = "200", description = "검색 성공")
    @GetMapping("/search")
    public ResponseEntity<InfinityListApiResult<MessageDto>> searchMessages(
            @CurrentUser JwtPayload jwt,
            @Parameter(description = "Org ID") @PathVariable String orgId,
            @Parameter(description = "대화방 ID") @PathVariable String channelId,
            @Parameter(description = "검색 키워드") @RequestParam String keyword,
            @Parameter(description = "기준 메시지 ID") @RequestParam(required = false) String anchor,
            @Parameter(description = "anchor 이전 메시지 수") @RequestParam(defaultValue = "30") int before,
            @Parameter(description = "anchor 이후 메시지 수") @RequestParam(defaultValue = "0") int after
    ) {
        InfinityListApiResult<MessageDto> result = messageService.searchMessages(
                jwt.uid(), orgId, channelId, keyword, anchor, before, after);
        return ResponseEntity.ok(result);
    }
}
