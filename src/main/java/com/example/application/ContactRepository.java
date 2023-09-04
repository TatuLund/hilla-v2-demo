package com.example.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

    public Page<Contact> findAllByEmailContainsIgnoreCase(String email, Pageable pageable);
}
