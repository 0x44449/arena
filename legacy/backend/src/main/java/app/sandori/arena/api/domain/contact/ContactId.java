package app.sandori.arena.api.domain.contact;

import java.io.Serializable;
import java.util.Objects;

public class ContactId implements Serializable {

    private String ownerId;
    private String userId;

    public ContactId() {
    }

    public ContactId(String ownerId, String userId) {
        this.ownerId = ownerId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContactId that = (ContactId) o;
        return Objects.equals(ownerId, that.ownerId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ownerId, userId);
    }
}
