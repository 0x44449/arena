package app.sandori.arena.api.domain.message.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SyncMessagesQuery {

    private String since;
}
