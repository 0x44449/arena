package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.domain.message.dtos.CreateMessageRequest;
import app.sandori.arena.api.domain.message.dtos.GetMessagesQuery;
import app.sandori.arena.api.domain.message.dtos.MessageResponse;
import app.sandori.arena.api.domain.message.dtos.MessageSyncDataResponse;
import app.sandori.arena.api.domain.message.dtos.SyncMessagesQuery;
import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.global.dto.InfinityListApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "messages")
@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("channel/{channelId}")
    @RequireSession
    @Operation(summary = "메시지 보내기", operationId = "createMessage")
    public SingleApiResult<MessageResponse> createMessage(
            @CurrentUser CachedUser user,
            @PathVariable String channelId,
            @RequestBody CreateMessageRequest request) {
        MessageEntity message = messageService.createMessage(
                user.userId(), channelId, request.getContent());
        return SingleApiResult.of(MessageResponse.from(message));
    }

    @GetMapping("channel/{channelId}")
    @RequireSession
    @Operation(summary = "메시지 목록 조회", operationId = "getMessages")
    public InfinityListApiResult<MessageResponse> getMessages(
            @CurrentUser CachedUser user,
            @PathVariable String channelId,
            GetMessagesQuery query) {
        MessageService.GetMessagesResult result = messageService.getMessages(
                user.userId(), channelId,
                query.getBefore(), query.getAfter(), query.getAround(),
                query.getLimit());

        return InfinityListApiResult.of(
                result.messages().stream().map(MessageResponse::from).toList(),
                result.hasNext(),
                result.hasPrev()
        );
    }

    @GetMapping("channel/{channelId}/sync")
    @RequireSession
    @Operation(summary = "메시지 동기화", operationId = "syncMessages")
    public SingleApiResult<MessageSyncDataResponse> syncMessages(
            @CurrentUser CachedUser user,
            @PathVariable String channelId,
            SyncMessagesQuery query) {
        LocalDateTime since = LocalDateTime.parse(query.getSince(), DateTimeFormatter.ISO_DATE_TIME);

        MessageService.MessageSyncResult result = messageService.syncMessages(
                user.userId(), channelId, since);

        MessageSyncDataResponse data = new MessageSyncDataResponse(
                result.created().stream().map(MessageResponse::from).toList(),
                result.updated().stream().map(MessageResponse::from).toList(),
                result.deleted(),
                result.requireFullSync()
        );

        return SingleApiResult.of(data);
    }
}
