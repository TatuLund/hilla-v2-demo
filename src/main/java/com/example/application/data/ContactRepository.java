package com.example.application.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContactRepository extends JpaRepository<Contact, Integer>, JpaSpecificationExecutor<User> {

    public Page<Contact> findAllByEmailContainsIgnoreCase(String email, Pageable pageable);

}
