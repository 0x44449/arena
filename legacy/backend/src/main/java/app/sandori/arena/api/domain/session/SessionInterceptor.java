package app.sandori.arena.api.domain.session;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class SessionInterceptor implements HandlerInterceptor {

    public static final String CACHED_USER_ATTRIBUTE = "cachedUser";

    private final SessionService sessionService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequireSession annotation = handlerMethod.getMethodAnnotation(RequireSession.class);
        if (annotation == null) {
            return true;
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return true;
        }

        String uid = jwt.getSubject();
        if (uid == null) {
            return true;
        }

        CachedUser cachedUser = sessionService.getOrFetch(uid);
        request.setAttribute(CACHED_USER_ATTRIBUTE, cachedUser);

        return true;
    }
}
