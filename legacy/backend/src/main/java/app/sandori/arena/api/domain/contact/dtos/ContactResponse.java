package app.sandori.arena.api.domain.contact.dtos;

import app.sandori.arena.api.domain.contact.ContactEntity;
import app.sandori.arena.api.domain.user.dtos.UserResponse;
import java.time.LocalDateTime;

public record ContactResponse(
        UserResponse user,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ContactResponse from(ContactEntity entity) {
        return new ContactResponse(
                UserResponse.from(entity.getUser()),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
