package com.example.application.services;

import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.services.EventService.Message;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.EndpointSubscription;
import jakarta.annotation.security.PermitAll;
import reactor.core.publisher.Flux;

@PermitAll
@BrowserCallable
public class EventEndpoint {

    Logger logger = LoggerFactory.getLogger(EventEndpoint.class);

    private EventService service;

    public EventEndpoint(EventService service) {
        this.service = service;
    }

    public @NonNull Flux<Message> join() {
        return service.join();
    }

    public void send(Message message) {
        service.send(message);
    }

    public EndpointSubscription<@NonNull Message> getEventsCancellable() {
        logger.info("Events subscription has been requested");
        return EndpointSubscription.of(service.join(), () -> {
            logger.info("Subscription has been cancelled");
        });
    }
}
