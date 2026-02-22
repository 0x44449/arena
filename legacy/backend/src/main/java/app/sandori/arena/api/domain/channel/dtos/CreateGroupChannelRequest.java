package app.sandori.arena.api.domain.channel.dtos;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateGroupChannelRequest {

    private String name;
    private List<String> userIds;
    private String iconFileId;
}
