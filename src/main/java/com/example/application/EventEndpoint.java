package com.example.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.EventService.Message;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import dev.hilla.EndpointSubscription;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;

@AnonymousAllowed
@BrowserCallable
public class EventEndpoint {

    Logger logger = LoggerFactory.getLogger(EventEndpoint.class);

    private EventService service;

    public EventEndpoint(EventService service) {
        this.service = service;
    }

    public @Nonnull Flux<Message> join() {
        return service.join();
    }

    public void send(Message message) {
        service.send(message);
    }

    public EndpointSubscription<@Nonnull Message> getEventsCancellable() {
        logger.info("Events subscription has been requested");
        return EndpointSubscription.of(service.join(), () -> {
            logger.info("Subscription has been cancelled");
        });
    }
}
