package com.example.application;

import java.util.stream.Collectors;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import jakarta.annotation.Nonnull;

@BrowserCallable
@AnonymousAllowed
public class StatsEndpoint {

    public static class Stats {
        public @Nonnull Integer[] priorityCounts = new Integer[5];
        public @Nonnull Integer assigned = 0;
        public @Nonnull Integer done = 0;
    }

    private TodoRepository repository;

    public StatsEndpoint(TodoRepository repository) {
        this.repository = repository;
    }

    public @Nonnull Stats getStats() {
        var todos = repository.findAll();
        var stats = new Stats();
        stats.priorityCounts[0] = todos.stream().filter(t -> t.getPriority() != null && t.getPriority() == 1)
                .collect(Collectors.toList()).size();
        stats.priorityCounts[1] = todos.stream().filter(t -> t.getPriority() != null && t.getPriority() == 2)
                .collect(Collectors.toList()).size();
        stats.priorityCounts[2] = todos.stream().filter(t -> t.getPriority() != null && t.getPriority() == 3)
                .collect(Collectors.toList()).size();
        stats.priorityCounts[3] = todos.stream().filter(t -> t.getPriority() != null && t.getPriority() == 4)
                .collect(Collectors.toList()).size();
        stats.priorityCounts[4] = todos.stream().filter(t -> t.getPriority() != null && t.getPriority() == 5)
                .collect(Collectors.toList()).size();
        stats.assigned = todos.stream().filter(t -> t.getAssigned() != null).collect(Collectors.toList()).size();
        stats.done = todos.stream().filter(t -> t.isDone()).collect(Collectors.toList()).size();
        return stats;
    }
}
