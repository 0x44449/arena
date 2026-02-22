package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.domain.user.UserEntity;
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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_messages_channel_seq", columnList = "channelId, seq")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MessageEntity extends BaseTimeEntity {

    @Id
    private String messageId;

    @Column(nullable = false)
    private String channelId;

    @Column(nullable = false)
    private String senderId;

    @Column(nullable = false)
    private Long seq;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderId", referencedColumnName = "userId", insertable = false, updatable = false)
    private UserEntity sender;
}
