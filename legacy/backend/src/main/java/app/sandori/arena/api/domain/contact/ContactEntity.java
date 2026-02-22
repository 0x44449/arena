package app.sandori.arena.api.domain.contact;

import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacts")
@IdClass(ContactId.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContactEntity extends BaseTimeEntity {

    @Id
    private String ownerId;

    @Id
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId", referencedColumnName = "userId", insertable = false, updatable = false)
    private UserEntity owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId", insertable = false, updatable = false)
    private UserEntity user;

    public ContactEntity(String ownerId, String userId) {
        this.ownerId = ownerId;
        this.userId = userId;
    }
}
