package com.example.application;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.application.EventService.Message;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;


@Endpoint 
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
    Todo result = repository.save(todo);
    Message message = new Message();
    message.data = "Todo: "+todo.getId()+"/"+todo.getTask()+" saved!";
    logger.info(message.data);
    eventService.send(message);
    return result;
  }

  public void remove(List<Todo> todos) {
    Message message = new Message();
    message.data = "Todos: "+todos.stream().map(todo -> ""+todo.getId()).collect(Collectors.joining(","))+" removed!";
    logger.info(message.data);
    eventService.send(message);
    repository.deleteAll(todos);
  }
}