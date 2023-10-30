package com.example.application.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import com.example.application.data.Todo;
import com.example.application.data.TodoRepository;
import com.example.application.services.EventService.Message;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;
import dev.hilla.exception.EndpointException;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;

@BrowserCallable
@PermitAll
public class TodoEndpoint {

    Logger logger = LoggerFactory.getLogger(TodoEndpoint.class);

    private TodoRepository repository;
    private EventService eventService;

    public TodoEndpoint(TodoRepository repository, EventService eventService) {
        this.repository = repository;
        this.eventService = eventService;
    }

    @Transactional
    public @Nonnull List<@Nonnull Todo> findAll() {
        try {
            Thread.sleep(400);
        } catch (InterruptedException e) {
        }
        return repository.findAll();
    }

    @Transactional
    public Todo save(Todo todo) {
        Todo result;
        Optional<Todo> old;

        if (todo.getId() != null) {
            old = repository.findById(todo.getId());
        } else {
            old = Optional.empty();
        }

        var assignedChanged = isAssignedChanged(todo, old);
        var authorities = getAuthorities();
        if (assignedChanged && !authorities.contains("ROLE_ADMIN")) {
            logger.warn("Only the ADMIN is allowed to assign Todo!");
            throw new EndpointException("Only the ADMIN is allowed to assign Todo!");
        }

        Message message = new Message();

        if (old.isPresent()) {
            message.data = "Todo: " + todo.getId() + "/" + todo.getTask() + " updated!";
        } else {
            message.data = "Todo: " + todo.getId() + "/" + todo.getTask() + " saved!";
        }

        if (todo.getAssigned() != null && assignedChanged) {
            logger.info("Assignee changed to " + todo.getAssigned().getId() + " for todo " + todo.getId());
            boolean match = isAssigneeOccupied(todo);
            if (match) {
                logger.warn("Assignee " + todo.getAssigned().getId() + " already has a todo!");
                throw new EndpointException("Assignee " + todo.getAssigned().getId() + " already has a todo!");
            }
        }

        if (old.isPresent()) {
            Todo updated = old.get();
            updated.setAssigned(todo.getAssigned());
            updated.setDeadline(todo.getDeadline());
            updated.setDone(todo.isDone());
            updated.setPriority(todo.getPriority());
            updated.setTask(todo.getTask());
            updated.setDescription(todo.getDescription());
            result = repository.save(updated);
        } else {
            result = repository.save(todo);
        }
        logger.info(message.data);
        eventService.send(message);
        return result;
    }

    private List<String> getAuthorities() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        var authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        logger.info("Authorities: " + authorities.stream().collect(Collectors.joining(",")));
        return authorities;
    }

    private boolean isAssignedChanged(Todo todo, Optional<Todo> old) {
        if (old.isPresent()) {
            if (old.get().getAssigned() == null && todo.getAssigned() != null) {
                return true;
            } else if (todo.getAssigned() == null) {
                return false;
            }
            return old.get().getAssigned().getId() == todo.getAssigned().getId();
        }
        return true;
    }

    private boolean isAssigneeOccupied(Todo todo) {
        try {
            Thread.sleep(400);
        } catch (InterruptedException e) {
        }
        List<Todo> todos = repository.findAll();
        todos.removeIf(t -> t.getId() == todo.getId());
        IntStream ids = todos.stream().filter(t -> (t.getAssigned() != null)).mapToInt(t -> t.getAssigned().getId());
        boolean match = ids.anyMatch(id -> id == todo.getAssigned().getId());
        return match;
    }

    @Transactional
    @RolesAllowed("ADMIN")
    public void remove(List<Todo> todos) {
        Message message = new Message();
        message.data = "Todos: " + todos.stream().map(todo -> "" + todo.getId()).collect(Collectors.joining(","))
                + " removed!";
        logger.info(message.data);
        todos.stream().map(t1 -> repository.findById(t1.getId())).filter(Optional::isPresent).map(Optional::get)
                .forEach(t -> repository.delete(t));
        eventService.send(message);
    }
}