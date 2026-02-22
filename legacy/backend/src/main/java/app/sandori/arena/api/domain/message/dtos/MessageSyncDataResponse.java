package app.sandori.arena.api.domain.message.dtos;

import java.util.List;

public record MessageSyncDataResponse(
        List<MessageResponse> created,
        List<MessageResponse> updated,
        List<String> deleted,
        boolean requireFullSync
) {
}
