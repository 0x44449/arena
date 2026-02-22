package app.sandori.arena.api.security;

import app.sandori.arena.api.domain.session.CachedUser;
import app.sandori.arena.api.domain.session.SessionInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && (parameter.getParameterType().equals(JwtPayload.class)
                    || parameter.getParameterType().equals(CachedUser.class));
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        if (parameter.getParameterType().equals(CachedUser.class)) {
            HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
            return request.getAttribute(SessionInterceptor.CACHED_USER_ATTRIBUTE);
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return null;
        }
        return new JwtPayload(jwt.getSubject(), jwt.getClaimAsString("email"));
    }
}
