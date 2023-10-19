package com.example.application.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.data.Todo;
import com.example.application.data.TodoRepository;
import com.example.application.services.EventService.Message;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.BrowserCallable;
import dev.hilla.Nonnull;
import dev.hilla.exception.EndpointException;

@BrowserCallable
@AnonymousAllowed
public class TodoEndpoint {

  Logger logger = LoggerFactory.getLogger(TodoEndpoint.class);

  private TodoRepository repository;
  private EventService eventService;

  public TodoEndpoint(TodoRepository repository, EventService eventService) {
    this.repository = repository;
    this.eventService = eventService;
  }

  public @Nonnull List<@Nonnull Todo> findAll() {
    return repository.findAll();
  }

  public Todo save(Todo todo) {
    Todo result;
    Optional<Todo> old;

    if (todo.getId() != null) {
      old = repository.findById(todo.getId());
    } else {
      old = Optional.empty();
    }

    Message message = new Message();

    if (old.isPresent()) {
      message.data = "Todo: " + todo.getId() + "/" + todo.getTask() + " updated!";
    } else {
      message.data = "Todo: " + todo.getId() + "/" + todo.getTask() + " saved!";
    }

    if (todo.getAssigned() != null && isAssigneChanged(todo, old)) {
      logger.info("Assignee changed to " + todo.getAssigned().getId() + " for todo " + todo.getId());
      boolean match = isAssigneOccupied(todo);
      if (match) {
        throw new EndpointException("Assignee " + todo.getAssigned().getId() + " already has a todo!");
      }
    }
    result = repository.save(todo);
    logger.info(message.data);
    eventService.send(message);
    return result;
  }

  private boolean isAssigneChanged(Todo todo, Optional<Todo> old) {
    if (old.isPresent()) {
      if (old.get().getAssigned() == null && todo.getAssigned() != null) {
        return true;
      }
      return old.get().getAssigned().getId() == todo.getAssigned().getId();
    }
    return true;
  }

  private boolean isAssigneOccupied(Todo todo) {
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
    }
    List<Todo> todos = repository.findAll();
    todos.removeIf(t -> t.getId() == todo.getId());
    IntStream ids = todos.stream().filter(t -> (t.getAssigned() != null)).mapToInt(t -> t.getAssigned().getId());
    boolean match = ids.anyMatch(id -> id == todo.getAssigned().getId());
    return match;
  }

  public void remove(List<Todo> todos) {
    Message message = new Message();
    message.data = "Todos: " + todos.stream().map(todo -> "" + todo.getId()).collect(Collectors.joining(","))
        + " removed!";
    logger.info(message.data);
    repository.deleteAll(todos);
    eventService.send(message);
  }
}