package com.example.application.services;

import java.util.Collection;
import java.util.Collections;

import dev.hilla.Nonnull;

public class UserInfo {

    @Nonnull
    private String name;
    @Nonnull
    private byte[] picture;
    @Nonnull
    private String fullName;
    @Nonnull
    private Collection<String> authorities;

    public UserInfo(String name, Collection<String> authorities, String fullName, byte[] picture) {
        this.name = name;
        this.authorities = Collections.unmodifiableCollection(authorities);
        this.picture = picture;
        this.fullName = fullName;
    }

    public String getName() {
        return name;
    }

    public Collection<String> getAuthorities() {
        return authorities;
    }

    public String getFullName() {
        return fullName;
    }

    public byte[] getPicture() {
        return picture;
    }
}