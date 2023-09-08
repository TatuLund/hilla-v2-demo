package com.example.application;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;

import com.example.application.EventService.Message;
import com.example.application.EventService.MessageType;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import dev.hilla.exception.EndpointException;

@Endpoint
@AnonymousAllowed
public class TodoEndpoint {

  Logger logger = LoggerFactory.getLogger(TodoEndpoint.class);

  private TodoRepository repository;
  private EventService eventService;
  private ContactRepository contactRepository;

  public TodoEndpoint(TodoRepository repository, EventService eventService, ContactRepository contactRepository) {
    this.repository = repository;
    this.eventService = eventService;
    this.contactRepository = contactRepository;
  }

  public @Nonnull List<@Nonnull Todo> findAll() {
    return repository.findAll();
  }

  public Todo save(Todo todo) {
    Message message = new Message();
    if (todo.getAssigned() != null) {
      boolean match = isAssigneOccupied(todo);
      if (match) {
        throw new EndpointException("Assignee " + todo.getAssigned().getId() + " already has a todo!");
      }
    }
    Todo result = repository.save(todo);
    message.data = "Todo: " + todo.getId() + "/" + todo.getTask() + " saved!";
    logger.info(message.data);
    eventService.send(message);
    return result;
  }

  private boolean isAssigneOccupied(Todo todo) {
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
    }
    List<Todo> todos = repository.findAll();
    IntStream ids = todos.stream().filter(t -> (t.getAssigned() != null)).mapToInt(t -> t.getAssigned().getId());
    boolean match = ids.anyMatch(id -> id == todo.getAssigned().getId());
    return match;
  }

  public void remove(List<Todo> todos) {
    Message message = new Message();
    message.data = "Todos: " + todos.stream().map(todo -> "" + todo.getId()).collect(Collectors.joining(","))
        + " removed!";
    logger.info(message.data);
    eventService.send(message);
    repository.deleteAll(todos);
  }
}