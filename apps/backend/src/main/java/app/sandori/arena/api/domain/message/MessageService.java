package app.sandori.arena.api.domain.message;

import app.sandori.arena.api.domain.channel.ChannelEntity;
import app.sandori.arena.api.domain.channel.ChannelMemberRepository;
import app.sandori.arena.api.domain.channel.ChannelRepository;
import app.sandori.arena.api.domain.message.dtos.MessageDto;
import app.sandori.arena.api.domain.message.dtos.SendMessageDto;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.dto.InfinityListApiResult;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final ChannelMemberRepository channelMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public MessageService(
            MessageRepository messageRepository,
            ChannelRepository channelRepository,
            ChannelMemberRepository channelMemberRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.channelMemberRepository = channelMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public MessageDto sendMessage(String uid, String orgId, String channelId, SendMessageDto request) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, profile.getProfileId());

        MessageEntity message = new MessageEntity(channelId, profile.getProfileId(), request.content());
        messageRepository.save(message);

        return MessageDto.from(message);
    }

    public InfinityListApiResult<MessageDto> getMessages(
            String uid, String orgId, String channelId,
            String anchor, int before, int after
    ) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, profile.getProfileId());

        return fetchMessages(channelId, anchor, before, after, null);
    }

    public void deleteMessage(String uid, String orgId, String channelId, String messageId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, profile.getProfileId());

        MessageEntity message = messageRepository.findByMessageIdAndDeletedAtIsNull(messageId)
                .orElseThrow(() -> new WellKnownException("MESSAGE_NOT_FOUND"));
        if (!message.getChannelId().equals(channelId)) {
            throw new WellKnownException("MESSAGE_NOT_FOUND");
        }
        if (!message.getSenderId().equals(profile.getProfileId())) {
            throw new WellKnownException("NOT_MESSAGE_SENDER");
        }

        message.softDelete();
        messageRepository.save(message);
    }

    public InfinityListApiResult<MessageDto> searchMessages(
            String uid, String orgId, String channelId,
            String keyword, String anchor, int before, int after
    ) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        findActiveChannel(channelId, orgId);
        requireChannelMember(channelId, profile.getProfileId());

        return fetchMessages(channelId, anchor, before, after, keyword);
    }

    private InfinityListApiResult<MessageDto> fetchMessages(
            String channelId, String anchor, int before, int after, String keyword
    ) {
        // anchor 없음 → 최신 before건
        if (anchor == null) {
            List<MessageEntity> fetched = (keyword == null)
                    ? messageRepository.findLatest(channelId, PageRequest.of(0, before + 1))
                    : messageRepository.searchLatest(channelId, keyword, PageRequest.of(0, before + 1));

            boolean hasPrev = fetched.size() > before;
            List<MessageEntity> result = hasPrev ? fetched.subList(0, before) : fetched;

            return InfinityListApiResult.of(
                    result.stream().map(MessageDto::from).toList(),
                    false,
                    hasPrev
            );
        }

        // anchor 메시지 조회
        MessageEntity anchorMessage = messageRepository.findByMessageIdAndDeletedAtIsNull(anchor)
                .orElseThrow(() -> new WellKnownException("MESSAGE_NOT_FOUND"));

        // before + after 동시 요청
        if (before > 0 && after > 0) {
            List<MessageEntity> beforeList = fetchBefore(channelId, anchorMessage, before, keyword);
            List<MessageEntity> afterList = fetchAfter(channelId, anchorMessage, after, keyword);

            boolean hasPrev = beforeList.size() > before;
            boolean hasNext = afterList.size() > after;

            List<MessageEntity> trimmedBefore = hasPrev ? beforeList.subList(0, before) : beforeList;
            List<MessageEntity> trimmedAfter = hasNext ? afterList.subList(0, after) : afterList;

            // before(DESC) → reverse → anchor → after(ASC) 순으로 합침
            List<MessageDto> combined = new ArrayList<>();
            List<MessageEntity> beforeReversed = new ArrayList<>(trimmedBefore);
            Collections.reverse(beforeReversed);
            beforeReversed.forEach(m -> combined.add(MessageDto.from(m)));
            combined.add(MessageDto.from(anchorMessage));
            trimmedAfter.forEach(m -> combined.add(MessageDto.from(m)));

            return InfinityListApiResult.of(combined, hasNext, hasPrev);
        }

        // before만
        if (before > 0) {
            List<MessageEntity> fetched = fetchBefore(channelId, anchorMessage, before, keyword);
            boolean hasPrev = fetched.size() > before;
            List<MessageEntity> result = hasPrev ? fetched.subList(0, before) : fetched;

            List<MessageDto> dtos = new ArrayList<>(result.stream().map(MessageDto::from).toList());
            Collections.reverse(dtos);

            return InfinityListApiResult.of(dtos, true, hasPrev);
        }

        // after만
        if (after > 0) {
            List<MessageEntity> fetched = fetchAfter(channelId, anchorMessage, after, keyword);
            boolean hasNext = fetched.size() > after;
            List<MessageEntity> result = hasNext ? fetched.subList(0, after) : fetched;

            return InfinityListApiResult.of(
                    result.stream().map(MessageDto::from).toList(),
                    hasNext,
                    true
            );
        }

        // before=0, after=0 → anchor만 반환
        return InfinityListApiResult.of(
                List.of(MessageDto.from(anchorMessage)),
                false,
                false
        );
    }

    private List<MessageEntity> fetchBefore(String channelId, MessageEntity anchor, int limit, String keyword) {
        PageRequest page = PageRequest.of(0, limit + 1);
        if (keyword == null) {
            return messageRepository.findBefore(channelId, anchor.getCreatedAt(), anchor.getMessageId(), page);
        }
        return messageRepository.searchBefore(channelId, keyword, anchor.getCreatedAt(), anchor.getMessageId(), page);
    }

    private List<MessageEntity> fetchAfter(String channelId, MessageEntity anchor, int limit, String keyword) {
        PageRequest page = PageRequest.of(0, limit + 1);
        if (keyword == null) {
            return messageRepository.findAfter(channelId, anchor.getCreatedAt(), anchor.getMessageId(), page);
        }
        return messageRepository.searchAfter(channelId, keyword, anchor.getCreatedAt(), anchor.getMessageId(), page);
    }

    private ProfileEntity findOrgProfile(String uid, String orgId) {
        UserEntity user = userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
        return profileRepository.findByUserIdAndOrgIdAndDeletedAtIsNull(user.getUserId(), orgId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
    }

    private ChannelEntity findActiveChannel(String channelId, String orgId) {
        ChannelEntity channel = channelRepository.findByChannelIdAndDeletedAtIsNull(channelId)
                .orElseThrow(() -> new WellKnownException("CHANNEL_NOT_FOUND"));
        if (!channel.getOrgId().equals(orgId)) {
            throw new WellKnownException("CHANNEL_NOT_FOUND");
        }
        return channel;
    }

    private void requireChannelMember(String channelId, String profileId) {
        if (!channelMemberRepository.existsByChannelIdAndProfileId(channelId, profileId)) {
            throw new WellKnownException("NOT_CHANNEL_MEMBER");
        }
    }
}
