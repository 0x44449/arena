package app.sandori.arena.api.domain.team;

import app.sandori.arena.api.domain.org.OrgMemberEntity;
import app.sandori.arena.api.domain.org.OrgMemberRepository;
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
    private final OrgMemberRepository orgMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public TeamService(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            OrgMemberRepository orgMemberRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.orgMemberRepository = orgMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public TeamDto createTeam(String uid, String orgId, CreateTeamDto request) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        TeamEntity team = new TeamEntity(orgId, request.name());
        teamRepository.save(team);

        return TeamDto.from(team, 0);
    }

    public List<TeamDto> getTeams(String uid, String orgId) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());

        List<TeamEntity> teams = teamRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);

        return teams.stream()
                .map(team -> {
                    int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(team.getTeamId()).size();
                    return TeamDto.from(team, count);
                })
                .toList();
    }

    public TeamDto getTeam(String uid, String orgId, String teamId) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());

        TeamEntity team = findActiveTeam(teamId, orgId);
        int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId).size();

        return TeamDto.from(team, count);
    }

    public TeamDto updateTeam(String uid, String orgId, String teamId, UpdateTeamDto request) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        TeamEntity team = findActiveTeam(teamId, orgId);
        request.name().ifPresent(team::changeName);
        teamRepository.save(team);

        int count = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId).size();
        return TeamDto.from(team, count);
    }

    public void deleteTeam(String uid, String orgId, String teamId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());

        TeamEntity team = findActiveTeam(teamId, orgId);
        team.softDelete();
        teamRepository.save(team);
    }

    public TeamMemberDto addMember(String uid, String orgId, String teamId, AddTeamMemberDto request) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());
        findActiveTeam(teamId, orgId);

        // 추가 대상이 Org 멤버인지 확인
        if (!orgMemberRepository.existsByOrgIdAndUserIdAndDeletedAtIsNull(orgId, request.userId())) {
            throw new WellKnownException("NOT_ORG_MEMBER");
        }

        if (teamMemberRepository.existsByTeamIdAndUserIdAndDeletedAtIsNull(teamId, request.userId())) {
            throw new WellKnownException("ALREADY_TEAM_MEMBER");
        }

        TeamMemberEntity member = new TeamMemberEntity(teamId, request.userId());
        teamMemberRepository.save(member);

        ProfileEntity profile = profileRepository
                .findByUserIdAndOrgIdAndDeletedAtIsNull(request.userId(), orgId)
                .orElse(null);

        return TeamMemberDto.from(member, profile);
    }

    public List<TeamMemberDto> getMembers(String uid, String orgId, String teamId) {
        UserEntity user = findUserByUid(uid);
        requireOrgMember(orgId, user.getUserId());
        findActiveTeam(teamId, orgId);

        List<TeamMemberEntity> members = teamMemberRepository.findAllByTeamIdAndDeletedAtIsNull(teamId);
        List<ProfileEntity> profiles = profileRepository.findAllByOrgIdAndDeletedAtIsNull(orgId);

        Map<String, ProfileEntity> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileEntity::getUserId, Function.identity()));

        return members.stream()
                .map(m -> TeamMemberDto.from(m, profileMap.get(m.getUserId())))
                .toList();
    }

    public void removeMember(String uid, String orgId, String teamId, String teamMemberId) {
        UserEntity user = findUserByUid(uid);
        requireOwner(orgId, user.getUserId());
        findActiveTeam(teamId, orgId);

        TeamMemberEntity member = teamMemberRepository.findByTeamMemberIdAndDeletedAtIsNull(teamMemberId)
                .orElseThrow(() -> new WellKnownException("TEAM_MEMBER_NOT_FOUND"));

        if (!member.getTeamId().equals(teamId)) {
            throw new WellKnownException("TEAM_MEMBER_NOT_FOUND");
        }

        member.softDelete();
        teamMemberRepository.save(member);
    }

    private UserEntity findUserByUid(String uid) {
        return userRepository.findByUidAndDeletedAtIsNull(uid)
                .orElseThrow(() -> new WellKnownException("USER_NOT_FOUND"));
    }

    private TeamEntity findActiveTeam(String teamId, String orgId) {
        TeamEntity team = teamRepository.findByTeamIdAndDeletedAtIsNull(teamId)
                .orElseThrow(() -> new WellKnownException("TEAM_NOT_FOUND"));
        if (!team.getOrgId().equals(orgId)) {
            throw new WellKnownException("TEAM_NOT_FOUND");
        }
        return team;
    }

    private void requireOrgMember(String orgId, String userId) {
        if (!orgMemberRepository.existsByOrgIdAndUserIdAndDeletedAtIsNull(orgId, userId)) {
            throw new WellKnownException("NOT_ORG_MEMBER");
        }
    }

    private void requireOwner(String orgId, String userId) {
        OrgMemberEntity member = orgMemberRepository.findByOrgIdAndUserIdAndDeletedAtIsNull(orgId, userId)
                .orElseThrow(() -> new WellKnownException("NOT_ORG_MEMBER"));
        if (!OrgMemberEntity.ROLE_OWNER.equals(member.getRole())) {
            throw new WellKnownException("PERMISSION_DENIED");
        }
    }
}
