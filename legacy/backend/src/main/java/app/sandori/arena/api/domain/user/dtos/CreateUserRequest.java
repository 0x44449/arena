package app.sandori.arena.api.domain.user.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    private String nick;
    private String email;
    private String statusMessage;
}
