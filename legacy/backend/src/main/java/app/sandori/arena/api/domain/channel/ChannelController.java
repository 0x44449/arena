package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.channel.dtos.ChannelResponse;
import app.sandori.arena.api.domain.channel.dtos.CreateDirectChannelRequest;
import app.sandori.arena.api.domain.channel.dtos.CreateGroupChannelRequest;
import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.RequireSession;
import app.sandori.arena.api.global.dto.ListApiResult;
import app.sandori.arena.api.global.dto.SingleApiResult;
import app.sandori.arena.api.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "channels")
@RestController
@RequestMapping("/api/v1/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @PostMapping("direct")
    @RequireSession
    @Operation(summary = "DM 생성 (이미 있으면 기존 반환)", operationId = "createDirectChannel")
    public SingleApiResult<ChannelResponse> createDirectChannel(
            @CurrentUser CachedUser user,
            @RequestBody CreateDirectChannelRequest request) {
        ChannelService.ChannelWithDetails result = channelService
                .getOrCreateDirectChannel(user.userId(), request.getUserId());
        return SingleApiResult.of(ChannelResponse.from(
                result.channel(), result.groupChannel(), result.participants()));
    }

    @PostMapping("group")
    @RequireSession
    @Operation(summary = "그룹 채널 생성", operationId = "createGroupChannel")
    public SingleApiResult<ChannelResponse> createGroupChannel(
            @CurrentUser CachedUser user,
            @RequestBody CreateGroupChannelRequest request) {
        ChannelService.ChannelWithDetails result = channelService.createGroupChannel(
                user.userId(),
                request.getName(),
                request.getUserIds() != null ? request.getUserIds() : Collections.emptyList(),
                request.getIconFileId());
        return SingleApiResult.of(ChannelResponse.from(
                result.channel(), result.groupChannel(), result.participants()));
    }

    @GetMapping
    @RequireSession
    @Operation(summary = "내 채널 목록", operationId = "getMyChannels")
    public ListApiResult<ChannelResponse> getMyChannels(@CurrentUser CachedUser user) {
        List<ChannelService.ChannelWithDetails> results = channelService.getMyChannels(user.userId());
        List<ChannelResponse> data = results.stream()
                .map(r -> ChannelResponse.from(r.channel(), r.groupChannel(), r.participants()))
                .toList();
        return ListApiResult.of(data);
    }

    @GetMapping("{channelId}")
    @RequireSession
    @Operation(summary = "채널 상세 조회", operationId = "getChannel")
    public SingleApiResult<ChannelResponse> getChannel(
            @CurrentUser CachedUser user,
            @PathVariable String channelId) {
        ChannelService.ChannelWithDetails result = channelService.getChannel(channelId, user.userId());
        return SingleApiResult.of(ChannelResponse.from(
                result.channel(), result.groupChannel(), result.participants()));
    }
}
