package app.sandori.arena.api.domain.team;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.ProfileRepository;
import app.sandori.arena.api.domain.team.dtos.AddTeamMemberDto;
import app.sandori.arena.api.domain.team.dtos.CreateTeamDto;
import app.sandori.arena.api.domain.team.dtos.TeamDto;
import app.sandori.arena.api.domain.team.dtos.TeamMemberDto;
import app.sandori.arena.api.domain.team.dtos.UpdateTeamDto;
import app.sandori.arena.api.domain.user.UserEntity;
import app.sandori.arena.api.domain.user.UserRepository;
import app.sandori.arena.api.global.exception.WellKnownException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public TeamService(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public TeamDto createTeam(String uid, String orgId, CreateTeamDto request) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);

        TeamEntity team = new TeamEntity(orgId, request.name());
        teamRepository.save(team);

        return TeamDto.from(team, 0);
    }

    public List<TeamDto> getTeams(String uid, String orgId) {
        findOrgProfile(uid, orgId);

        List<TeamEntity> teams = teamRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);

        return teams.stream()
                .map(team -> {
                    int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(team.getTeamId()).size();
                    return TeamDto.from(team, count);
                })
                .toList();
    }

    public TeamDto getTeam(String uid, String orgId, String teamId) {
        findOrgProfile(uid, orgId);

        TeamEntity team = findActiveTeam(teamId, orgId);
        int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId).size();

        return TeamDto.from(team, count);
    }

    public TeamDto updateTeam(String uid, String orgId, String teamId, UpdateTeamDto request) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);

        TeamEntity team = findActiveTeam(teamId, orgId);
        request.name().ifPresent(team::changeName);
        teamRepository.save(team);

        int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId).size();
        return TeamDto.from(team, count);
    }

    public void deleteTeam(String uid, String orgId, String teamId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);

        TeamEntity team = findActiveTeam(teamId, orgId);
        team.softDelete();
        teamRepository.save(team);
    }

    public TeamMemberDto addMember(String uid, String orgId, String teamId, AddTeamMemberDto request) {
        ProfileEntity myProfile = findOrgProfile(uid, orgId);
        requireOwner(myProfile);
        findActiveTeam(teamId, orgId);

        // 추가 대상 프로필이 해당 Org 소속인지 확인
        ProfileEntity targetProfile = profileRepository.findByProfileIdAndDeletedAtIsNull(request.profileId())
                .orElseThrow(() -> new WellKnownException("PROFILE_NOT_FOUND"));
        if (!orgId.equals(targetProfile.getOrgId())) {
            throw new WellKnownException("NOT_ORG_MEMBER");
        }

        if (teamMemberRepository.existsByTeamIdAndProfileIdAndDeletedAtIsNull(teamId, request.profileId())) {
            throw new WellKnownException("ALREADY_TEAM_MEMBER");
        }

        TeamMemberEntity member = new TeamMemberEntity(teamId, request.profileId());
        teamMemberRepository.save(member);

        return TeamMemberDto.from(member, targetProfile);
    }

    public List<TeamMemberDto> getMembers(String uid, String orgId, String teamId) {
        findOrgProfile(uid, orgId);
        findActiveTeam(teamId, orgId);

        List<TeamMemberEntity> members = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId);

        Map<String, ProfileEntity> profileMap = members.stream()
                .map(m -> profileRepository.findByProfileIdAndDeletedAtIsNull(m.getProfileId()).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toMap(ProfileEntity::getProfileId, Function.identity()));

        return members.stream()
                .map(m -> TeamMemberDto.from(m, profileMap.get(m.getProfileId())))
                .toList();
    }

    public void removeMember(String uid, String orgId, String teamId, String teamMemberId) {
        ProfileEntity profile = findOrgProfile(uid, orgId);
        requireOwner(profile);
        findActiveTeam(teamId, orgId);

        TeamMemberEntity member = teamMemberRepository.findByTeamMemberIdAndDeletedAtIsNull(teamMemberId)
                .orElseThrow(() -> new WellKnownException("TEAM_MEMBER_NOT_FOUND"));

        if (!member.getTeamId().equals(teamId)) {
            throw new WellKnownException("TEAM_MEMBER_NOT_FOUND");
        }

        member.softDelete();
        teamMemberRepository.save(member);
    }

    /**
     * uid로 User를 찾고, 해당 Org의 프로필을 반환. 프로필이 없으면 Org 멤버가 아님.
     */
    private ProfileEntity findOrgProfile(String uid, String orgId) {
        UserEntity user = userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
        return profileRepository.findByUserIdAndOrgIdAndDeletedAtIsNull(user.getUserId(), orgId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
    }

    private TeamEntity findActiveTeam(String teamId, String orgId) {
        TeamEntity team = teamRepository.findByTeamIdAndDeletedAtIsNull(teamId)
                .orElseThrow(() -> new WellKnownException("TEAM_NOT_FOUND"));
        if (!team.getOrgId().equals(orgId)) {
            throw new WellKnownException("TEAM_NOT_FOUND");
        }
        return team;
    }

    private void requireOwner(ProfileEntity profile) {
        if (!ProfileEntity.ROLE_OWNER.equals(profile.getRole())) {
            throw new WellKnownException("PERMISSION_DENIED");
        }
    }
}
