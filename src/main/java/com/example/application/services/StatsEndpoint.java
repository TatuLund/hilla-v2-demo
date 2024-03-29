package com.example.application.services;

import java.time.LocalDate;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import com.example.application.data.TodoRepository;

import dev.hilla.BrowserCallable;
import jakarta.annotation.Nonnull;
import jakarta.annotation.security.PermitAll;

@BrowserCallable
@PermitAll
public class StatsEndpoint {

    public static class Stats {
        public @Nonnull Integer[] priorityCounts = new Integer[5];
        public @Nonnull Map<LocalDate, Integer> deadlines = new TreeMap<>();
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

        todos.stream().filter(t -> t.getDeadline() != null).forEach(t -> {
            if (stats.deadlines.containsKey(t.getDeadline())) {
                stats.deadlines.put(t.getDeadline(), stats.deadlines.get(t.getDeadline()) + 1);
            } else {
                stats.deadlines.put(t.getDeadline(), 1);
            }
        });

        stats.assigned = todos.stream().filter(t -> t.getAssigned() != null).collect(Collectors.toList()).size();
        stats.done = todos.stream().filter(t -> t.isDone()).collect(Collectors.toList()).size();

        return stats;
    }
}
