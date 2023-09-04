package com.example.application;

import org.springframework.stereotype.Service;

import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitFailureHandler;
import reactor.core.publisher.Sinks.EmitResult;
import reactor.core.publisher.Sinks.Many;

@Service
public class EventService {

    public static class Message {
        public @Nonnull String data;
    }

    private Many<Message> event;
    private Flux<Message> bus;

    public EventService() {
        event = Sinks.many().multicast().directBestEffort();
        bus = event.asFlux().replay(1).autoConnect();
    }

    public @Nonnull Flux<Message> join() {
        return bus;
    }

    public void send(Message message) {
        event.emitNext(message, emitFailureHandler());
    }

    private EmitFailureHandler emitFailureHandler() {
        return (signalType,
                emitResult) -> emitResult == EmitResult.FAIL_NON_SERIALIZED;
    }
}
