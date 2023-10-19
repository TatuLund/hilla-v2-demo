package com.example.application.services;

import java.util.List;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.data.Contact;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;

@BrowserCallable
@PermitAll
public class ContactEndpoint {

    private ContactService contactService;
    
    Logger logger = LoggerFactory.getLogger(ContactEndpoint.class);

    static class PageResponse {
        @Nonnull
        public List<@Nonnull Contact> content;
        @Nonnull
        public Long size;
    }

    public ContactEndpoint(ContactService contactService) {
        this.contactService = contactService;
    }

    @Nonnull
    public PageResponse getPage(int page, int pageSize, String filter, String direction) {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
        }
        var dbPage = contactService.getPage(page, pageSize, filter, direction);
        var response = new PageResponse();
        response.content = dbPage.getContent();
        response.size = dbPage.getTotalElements();
        logger.info("Page "+page+" fetched with "+pageSize+"/"+response.size+" items");
        return response;
    }
    
    public long getCount() {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
        } 
        return contactService.getCount();
    }

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @Nonnull
    @RolesAllowed("ADMIN")
    public Contact saveContact(Contact contact) {
        // Only use the id of the company, we don't want to update anything else on
        // Company.
        logger.info("Saving new contact: "+contact.getId());
        return contactService.saveContact(contact);
    }

    // Secure endpoint method for ADMIN users only as user can re-enable buttons
    // using browser devtools, etc.
    @RolesAllowed("ADMIN")
    public void deleteContact(Integer contactId) {
        logger.info("Deleting contact: "+contactId);
        contactService.deleteContact(contactId);
    }
}
