package com.example.application.security;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import com.vaadin.hilla.route.RouteUtil;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends VaadinWebSecurity {

    // create file "config/secrets/application.properties"
    // use this command to generate new random secret for your app:
    // openssl rand -base64 32
    @Value("${com.example.application.app.secret}")
    private String authSecret;

    private final RouteUtil routeUtil;

    public SecurityConfig(RouteUtil routeUtil) {
      this.routeUtil = routeUtil;
    }
 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Delegating the responsibility of general configurations
        // of http security to the super class. It's configuring
        // the followings: Vaadin's CSRF protection by ignoring
        // framework's internal requests, null request cache,
        // ignoring public views annotated with @AnonymousAllowed,
        // restricting access to other views/endpoints, and enabling
        // ViewAccessChecker authorization.
        // You can add any possible extra configurations of your own
        // here (the following is just an example):

        // http.rememberMe().alwaysRemember(false);

        // Icons from the line-awesome addon
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers(routeUtil::isRouteAllowed, new AntPathRequestMatcher("/images/*.png"),
                        new AntPathRequestMatcher("/line-awesome/**/*.svg"))
                .permitAll());

        // Configure your static resources with public access before calling
        // super.configure(HttpSecurity) as it adds final anyRequest matcher
        super.configure(http);

        // Disable creating and using sessions in Spring Security
        http.sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Register your login view to the view access checker mechanism
        setLoginView(http, "/login", "/");

        // Enable stateless authentication
        setStatelessAuthentication(http,
                new SecretKeySpec(Base64.getDecoder().decode(authSecret),
                        JwsAlgorithms.HS256),
                "com.example.application");
    }

    // @Bean
    // public UserDetailsManager userDetailsService() {
    // UserDetails user = User.withUsername("user")
    // .password("{noop}user")
    // .roles("USER")
    // .build();
    // UserDetails admin = User.withUsername("admin")
    // .password("{noop}admin")
    // .roles("ADMIN")
    // .build();
    // return new InMemoryUserDetailsManager(user, admin);
    // }
}
