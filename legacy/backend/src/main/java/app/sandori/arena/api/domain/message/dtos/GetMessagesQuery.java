package app.sandori.arena.api.domain.message.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetMessagesQuery {

    private String before;
    private String after;
    private String around;
    private Integer limit;
}
