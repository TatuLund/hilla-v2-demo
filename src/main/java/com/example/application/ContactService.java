package com.example.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Page<Contact> getPage(int page, int pageSize, String filter) {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
        }
        var dbPage = contactRepository.findAllByEmailContainsIgnoreCase(filter, PageRequest.of(page, pageSize));
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
