package app.sandori.arena.api.domain.file.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterFileRequest {

    private String key;
    private String name;
}
