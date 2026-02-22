package app.sandori.arena.api.domain.channel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupParticipantRepository extends JpaRepository<GroupParticipantEntity, ParticipantId> {
}
