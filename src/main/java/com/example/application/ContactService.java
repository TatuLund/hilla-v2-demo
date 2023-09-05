package com.example.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Page<Contact> getPage(int page, int pageSize, String filter, String direction) {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
        }
        PageRequest request = null;
        if (direction == null) {
            request = PageRequest.of(page, pageSize);
        } else if (direction.equals("asc")) {
            request = PageRequest.of(page, pageSize, Sort.by("lastName", "firstName").ascending());
        } else if (direction.equals("desc")) {
            request = PageRequest.of(page, pageSize, Sort.by("lastName", "firstName").descending());
        }
        var dbPage = contactRepository.findAllByEmailContainsIgnoreCase(filter, request);
        return dbPage;
    }

    public long getCount() {
        return contactRepository.count();
    }

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteContact(Integer contactId) {
        contactRepository.deleteById(contactId);
    }
}
