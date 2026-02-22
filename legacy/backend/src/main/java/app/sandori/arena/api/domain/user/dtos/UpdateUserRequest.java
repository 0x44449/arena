package app.sandori.arena.api.domain.user.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    private String nick;
    private String statusMessage;

    private String avatarFileId;

    @JsonIgnore
    private boolean avatarFileIdProvided = false;

    @JsonProperty("avatarFileId")
    public void setAvatarFileId(String avatarFileId) {
        this.avatarFileId = avatarFileId;
        this.avatarFileIdProvided = true;
    }
}
