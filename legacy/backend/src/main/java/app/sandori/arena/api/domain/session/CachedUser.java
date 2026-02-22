package app.sandori.arena.api.domain.session;

public record CachedUser(
        String userId,
        String uid,
        String utag,
        String nick,
        String email
) {
}
