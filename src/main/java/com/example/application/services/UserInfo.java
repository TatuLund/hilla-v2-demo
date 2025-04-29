package com.example.application.services;

import java.util.Collection;
import java.util.Collections;

import org.jspecify.annotations.NonNull;

public class UserInfo {

    @NonNull
    private String name;
    @NonNull
    private byte[] picture;
    @NonNull
    private String fullName;
    @NonNull
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