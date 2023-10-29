package com.example.application.services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;

import com.example.application.data.User;
import com.example.application.data.UserRepository;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;
import jakarta.annotation.security.PermitAll;

@BrowserCallable
public class UserInfoService {

    @Autowired
    UserRepository userRepository;

    @PermitAll
    @Nonnull
    public UserInfo getUserInfo() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();

        if (auth == null) {
            return new UserInfo("anonymous", Collections.emptyList(), "anonymous", null);
        }

        List<String> authorities = null;
        byte[] picture = null;
        String fullName = null;

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt) {
            String username = ((Jwt) principal).getSubject();
            User userDetails = userRepository.findByUsername(username);
            picture = userDetails.getProfilePicture();
            fullName = userDetails.getName();
        }

        authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new UserInfo(auth.getName(), authorities, fullName, picture);
    }

}
