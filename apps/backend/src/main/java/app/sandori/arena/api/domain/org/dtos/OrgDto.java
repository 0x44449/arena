package app.sandori.arena.api.domain.org.dtos;

import app.sandori.arena.api.domain.org.OrgEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Org 응답")
public record OrgDto(
    @Schema(description = "Org ID")
    String orgId,

    @Schema(description = "조직명")
    String name,

    @Schema(description = "조직 설명")
    String description,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId,

    @Schema(description = "현재 사용자의 역할")
    String myRole
) {
    public static OrgDto from(OrgEntity org, String myRole) {
        return new OrgDto(
            org.getOrgId(),
            org.getName(),
            org.getDescription(),
            org.getAvatarFileId(),
            myRole
        );
    }
}
