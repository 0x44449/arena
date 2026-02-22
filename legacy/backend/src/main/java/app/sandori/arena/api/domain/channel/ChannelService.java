package app.sandori.arena.api.domain.channel;

import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import app.sandori.arena.api.global.util.IdGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ParticipantRepository participantRepository;
    private final DirectChannelRepository directChannelRepository;
    private final DirectParticipantRepository directParticipantRepository;
    private final GroupChannelRepository groupChannelRepository;
    private final GroupParticipantRepository groupParticipantRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public record ChannelWithDetails(
            ChannelEntity channel,
            List<ParticipantEntity> participants,
            GroupChannelEntity groupChannel
    ) {
    }

    @Transactional(readOnly = true)
    public List<ChannelWithDetails> getMyChannels(String userId) {
        List<ParticipantEntity> myParticipants = participantRepository.findByUserIdAndDeletedAtIsNull(userId);

        List<ChannelWithDetails> results = new ArrayList<>();
        for (ParticipantEntity myParticipant : myParticipants) {
            ChannelEntity channel = myParticipant.getChannel();

            List<ParticipantEntity> participants = participantRepository
                    .findByChannelIdAndDeletedAtIsNull(channel.getChannelId());

            GroupChannelEntity groupChannel = null;
            if ("group".equals(channel.getType())) {
                groupChannel = groupChannelRepository.findByChannelId(channel.getChannelId())
                        .orElse(null);
            }

            results.add(new ChannelWithDetails(channel, participants, groupChannel));
        }

        results.sort(Comparator.comparing(
                r -> r.channel().getLastMessageAt(),
                Comparator.nullsLast(Comparator.reverseOrder())
        ));

        return results;
    }

    @Transactional(readOnly = true)
    public ChannelWithDetails getChannel(String channelId, String userId) {
        ParticipantEntity myParticipant = participantRepository
                .findByChannelIdAndUserIdAndDeletedAtIsNull(channelId, userId)
                .orElseThrow(() -> new WellKnownException("CHANNEL_NOT_FOUND",
                        "Channel not found or not a participant"));

        ChannelEntity channel = channelRepository.findById(channelId).orElseThrow();

        List<ParticipantEntity> participants = participantRepository
                .findByChannelIdAndDeletedAtIsNull(channelId);

        GroupChannelEntity groupChannel = null;
        if ("group".equals(channel.getType())) {
            groupChannel = groupChannelRepository.findByChannelId(channelId).orElse(null);
        }

        return new ChannelWithDetails(channel, participants, groupChannel);
    }

    @Transactional
    public ChannelWithDetails getOrCreateDirectChannel(String myUserId, String targetUserId) {
        if (myUserId.equals(targetUserId)) {
            throw new WellKnownException("INVALID_DM_TARGET", "Cannot create DM with yourself");
        }

        UserEntity targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND", "Target user not found"));

        // 기존 DM 찾기
        @SuppressWarnings("unchecked")
        List<ChannelEntity> existing = entityManager.createQuery("""
                SELECT c FROM ChannelEntity c
                WHERE c.type = 'direct'
                AND EXISTS (SELECT 1 FROM ParticipantEntity p1 WHERE p1.channelId = c.channelId AND p1.userId = :userId1)
                AND EXISTS (SELECT 1 FROM ParticipantEntity p2 WHERE p2.channelId = c.channelId AND p2.userId = :userId2)
                """)
                .setParameter("userId1", myUserId)
                .setParameter("userId2", targetUserId)
                .getResultList();

        if (!existing.isEmpty()) {
            ChannelEntity channel = existing.get(0);
            List<ParticipantEntity> participants = participantRepository
                    .findByChannelIdAndDeletedAtIsNull(channel.getChannelId());
            return new ChannelWithDetails(channel, participants, null);
        }

        // 새 DM 생성
        String channelId = IdGenerator.generate();

        ChannelEntity channel = ChannelEntity.builder()
                .channelId(channelId)
                .type("direct")
                .name(null)
                .teamId(null)
                .lastMessageAt(null)
                .build();
        channelRepository.save(channel);

        directChannelRepository.save(new DirectChannelEntity(channelId));

        participantRepository.save(new ParticipantEntity(channelId, myUserId, null));
        directParticipantRepository.save(new DirectParticipantEntity(channelId, myUserId));

        participantRepository.save(new ParticipantEntity(channelId, targetUserId, null));
        directParticipantRepository.save(new DirectParticipantEntity(channelId, targetUserId));

        List<ParticipantEntity> participants = participantRepository
                .findByChannelIdAndDeletedAtIsNull(channelId);

        return new ChannelWithDetails(channel, participants, null);
    }

    @Transactional
    public ChannelWithDetails createGroupChannel(String creatorUserId, String name,
                                                  List<String> userIds, String iconFileId) {
        if (iconFileId != null) {
            // 아이콘 파일 존재 확인은 FK constraint로 위임
        }

        for (String userId : userIds) {
            if (!userRepository.existsById(userId)) {
                throw new WellKnownException("USER_NOT_FOUND", "User not found: " + userId);
            }
        }

        String channelId = IdGenerator.generate();

        ChannelEntity channel = ChannelEntity.builder()
                .channelId(channelId)
                .type("group")
                .name(name)
                .teamId(null)
                .lastMessageAt(null)
                .build();
        channelRepository.save(channel);

        GroupChannelEntity groupChannel = new GroupChannelEntity(channelId, iconFileId);
        groupChannelRepository.save(groupChannel);

        // 생성자를 owner로 추가
        participantRepository.save(new ParticipantEntity(channelId, creatorUserId, null));
        groupParticipantRepository.save(new GroupParticipantEntity(channelId, creatorUserId, "owner", null));

        // 초대된 유저들을 member로 추가
        for (String userId : userIds) {
            if (!userId.equals(creatorUserId)) {
                participantRepository.save(new ParticipantEntity(channelId, userId, null));
                groupParticipantRepository.save(new GroupParticipantEntity(channelId, userId, "member", null));
            }
        }

        List<ParticipantEntity> participants = participantRepository
                .findByChannelIdAndDeletedAtIsNull(channelId);

        GroupChannelEntity groupChannelWithIcon = groupChannelRepository.findByChannelId(channelId)
                .orElseThrow();

        return new ChannelWithDetails(channel, participants, groupChannelWithIcon);
    }
}
