package com.example.application.data;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import com.vaadin.hilla.Nonnull;

@Entity
public class Contact extends AbstractEntity {

    @NotEmpty
    @Nonnull
    private String firstName = "";

    @NotEmpty
    @Nonnull
    private String lastName = "";

    @Email
    @NotEmpty
    @Nonnull
    private String email = "";

    @Nonnull
    @NotNull
    private LocalDate date;

    @Override
    public String toString() {
        return firstName + " " + lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}
