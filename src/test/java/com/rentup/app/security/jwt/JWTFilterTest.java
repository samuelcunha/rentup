package com.rentup.app.security.jwt;

import static org.assertj.core.api.Assertions.assertThat;

import com.rentup.app.security.AuthoritiesConstants;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import tech.jhipster.config.JHipsterProperties;

@SuppressWarnings("ALL")
class JWTFilterTest {

    private TokenProvider tokenProvider;
    private JWTFilter jwtFilter;

    @BeforeEach
    public void setup() {
        var jHipsterProperties = new JHipsterProperties();
        var base64Secret = "fd54a45s65fds737b9aafcb3412e07ed99b267f33413274720ddbb7f6c5e64e9f14075f2d7ed041592f0b7657baf8";
        jHipsterProperties.getSecurity().getAuthentication().getJwt().setBase64Secret(base64Secret);

        tokenProvider = new TokenProvider(jHipsterProperties);
        ReflectionTestUtils.setField(tokenProvider, "key", Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret)));
        ReflectionTestUtils.setField(tokenProvider, "tokenValidityInMilliseconds", 60000);

        jwtFilter = new JWTFilter(tokenProvider);
    }

    @Test
    void testJWTFilter() {
        var authentication = new UsernamePasswordAuthenticationToken(
            "test-user",
            "test-password",
            Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.USER))
        );
        var jwt = tokenProvider.createToken(authentication, false);
        var request = MockServerHttpRequest.get("/api/test").header(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        var exchange = MockServerWebExchange.from(request);
        jwtFilter
            .filter(
                exchange,
                it ->
                    Mono
                        .subscriberContext()
                        .flatMap(c -> ReactiveSecurityContextHolder.getContext())
                        .map(SecurityContext::getAuthentication)
                        .doOnSuccess(auth -> assertThat(auth.getName()).isEqualTo("test-user"))
                        .doOnSuccess(auth -> assertThat(auth.getCredentials().toString()).hasToString(jwt))
                        .then()
            )
            .block();
    }

    @Test
    void testJWTFilterInvalidToken() {
        var jwt = "wrong_jwt";
        var request = MockServerHttpRequest.get("/api/test").header(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        var exchange = MockServerWebExchange.from(request);
        jwtFilter
            .filter(
                exchange,
                it ->
                    Mono
                        .subscriberContext()
                        .flatMap(c -> ReactiveSecurityContextHolder.getContext())
                        .map(SecurityContext::getAuthentication)
                        .doOnSuccess(auth -> assertThat(auth).isNull())
                        .then()
            )
            .block();
    }

    @Test
    void testJWTFilterMissingAuthorization() {
        var request = MockServerHttpRequest.get("/api/test");
        var exchange = MockServerWebExchange.from(request);
        jwtFilter
            .filter(
                exchange,
                it ->
                    Mono
                        .subscriberContext()
                        .flatMap(c -> ReactiveSecurityContextHolder.getContext())
                        .map(SecurityContext::getAuthentication)
                        .doOnSuccess(auth -> assertThat(auth).isNull())
                        .then()
            )
            .block();
    }

    @Test
    void testJWTFilterMissingToken() {
        var request = MockServerHttpRequest.get("/api/test").header(JWTFilter.AUTHORIZATION_HEADER, "Bearer ");
        var exchange = MockServerWebExchange.from(request);
        jwtFilter
            .filter(
                exchange,
                it ->
                    Mono
                        .subscriberContext()
                        .flatMap(c -> ReactiveSecurityContextHolder.getContext())
                        .map(SecurityContext::getAuthentication)
                        .doOnSuccess(auth -> assertThat(auth).isNull())
                        .then()
            )
            .block();
    }

    @Test
    void testJWTFilterWrongScheme() {
        var authentication = new UsernamePasswordAuthenticationToken(
            "test-user",
            "test-password",
            Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.USER))
        );
        var jwt = tokenProvider.createToken(authentication, false);
        var request = MockServerHttpRequest.get("/api/test").header(JWTFilter.AUTHORIZATION_HEADER, "Basic " + jwt);
        var exchange = MockServerWebExchange.from(request);
        jwtFilter
            .filter(
                exchange,
                it ->
                    Mono
                        .subscriberContext()
                        .flatMap(c -> ReactiveSecurityContextHolder.getContext())
                        .map(SecurityContext::getAuthentication)
                        .doOnSuccess(auth -> assertThat(auth).isNull())
                        .then()
            )
            .block();
    }
}
