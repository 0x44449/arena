package app.sandori.arena.api.domain.channel;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChannelRepository extends JpaRepository<ChannelEntity, String> {

    Optional<ChannelEntity> findByChannelIdAndDeletedAtIsNull(String channelId);

    // 두 프로필 사이 기존 DM 찾기
    @Query("SELECT c FROM ChannelEntity c " +
           "WHERE c.orgId = :orgId AND c.type = 'DM' AND c.deletedAt IS NULL " +
           "AND c.channelId IN (SELECT cm1.channelId FROM ChannelMemberEntity cm1 WHERE cm1.profileId = :profileId1 AND cm1.deletedAt IS NULL) " +
           "AND c.channelId IN (SELECT cm2.channelId FROM ChannelMemberEntity cm2 WHERE cm2.profileId = :profileId2 AND cm2.deletedAt IS NULL)")
    Optional<ChannelEntity> findDmBetween(
            @Param("orgId") String orgId,
            @Param("profileId1") String profileId1,
            @Param("profileId2") String profileId2
    );
}
