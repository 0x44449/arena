package app.sandori.arena.api.domain.file.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetPresignedUrlRequest {

    private String directory;
    private String mimeType;
}
