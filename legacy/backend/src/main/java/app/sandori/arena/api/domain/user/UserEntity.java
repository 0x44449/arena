package app.sandori.arena.api.domain.user;

import app.sandori.arena.api.domain.file.FileEntity;
import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_nick", columnList = "nick")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity extends BaseTimeEntity {

    @Id
    private String userId;

    @Column(nullable = false, unique = true)
    private String uid;

    @Column(nullable = false, unique = true, length = 8)
    private String utag;

    @Column(nullable = false, length = 32)
    private String nick;

    @Column(length = 255)
    private String email;

    @Column(length = 140)
    private String statusMessage;

    @Column
    private String avatarFileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatarFileId", referencedColumnName = "fileId", insertable = false, updatable = false)
    private FileEntity avatar;

    @Builder
    public UserEntity(String userId, String uid, String utag, String nick,
                      String email, String statusMessage, String avatarFileId) {
        this.userId = userId;
        this.uid = uid;
        this.utag = utag;
        this.nick = nick;
        this.email = email;
        this.statusMessage = statusMessage;
        this.avatarFileId = avatarFileId;
    }
}
