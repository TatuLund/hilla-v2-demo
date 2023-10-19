package com.example.application.services;

import com.example.application.data.User;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@BrowserCallable
@AnonymousAllowed
public class UserEndpoint {

    @Autowired
    private AuthenticatedUser authenticatedUser;

    public Optional<User> getAuthenticatedUser() {
        return authenticatedUser.get();
    }
}
