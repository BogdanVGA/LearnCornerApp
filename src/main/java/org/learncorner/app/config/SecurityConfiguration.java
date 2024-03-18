
package org.learncorner.app.config;

import com.okta.spring.boot.oauth.Okta;
import org.learncorner.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfiguration {

    @Value("${jwt.jwkUrl}")
    private String jwkUrl;

    private final UserRepository userRepo;

    @Autowired
    public SecurityConfiguration(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {

        http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(corsSpec -> corsSpec.configurationSource(corsConfig -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .authorizeExchange((exchanges) -> exchanges
                        .pathMatchers("/api/reviews/auth/**").authenticated()
                        .pathMatchers( "/api/events/auth/**").authenticated()
                        .pathMatchers("/api/courses/auth/**").authenticated()
                        .pathMatchers("/api/user/**").authenticated()
                        .anyExchange().permitAll()
                ).oauth2ResourceServer((oauth2) -> oauth2.jwt(jwt -> {
                    jwt.jwtDecoder(jwtDecoder());
                    jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor());
                }))
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance());

        // Force a non-empty response body for 401's to make the response friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }
    
    // Customize the JWT Decoder
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder
                .withJwkSetUri(jwkUrl).build();
    }

    // Customize the JWT Authentication Converter
    private Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesExtractor() {
        return jwt -> {
            String username = jwt.getClaimAsString("sub");
            return userRepo.findByUsername(username)
                    .map(user -> {
                        List<GrantedAuthority> authorityList =
                                Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole()));
                        System.out.println("User roles: " + authorityList);
                        // Create a new authentication token that includes the user's authorities and the Jwt itself.
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(username, null, authorityList);
                        // Include the JWT or specific claims as additional details.
                        authenticationToken.setDetails(jwt);
                        return authenticationToken;
                    });
        };
    }
}

// https://www.baeldung.com/spring-security-5-reactive
// https://docs.spring.io/spring-framework/reference/web/webflux-cors.html
// https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html
// Reactive: https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/jwt.html
// Servlet: https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html