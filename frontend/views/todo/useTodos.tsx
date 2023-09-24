import { useEffect, useState } from 'react';
import { useForm } from '@hilla/react-form';
import { EventEndpoint, TodoEndpoint } from 'Frontend/generated/endpoints';
import { EndpointError, Subscription } from '@hilla/frontend';
import type Todo from 'Frontend/generated/com/example/application/Todo';
import { Notification } from '@hilla/react-components/Notification.js';
import Message from 'Frontend/generated/com/example/application/EventService/Message';
import TodoModel from 'Frontend/generated/com/example/application/TodoModel';
import MessageType from 'Frontend/generated/com/example/application/EventService/MessageType';

// Use custom hook to fetch all todos from TodoEndpoint.findAll.
// Also subscribe to EventEndpoint.getEventsCancellable to get notifications from the backend.
// This hook is used in TodoView and wraps the model data and functions in an array.
export function useTodos() {
  const [subscription, setSubscription] = useState<Subscription<Message>>();
  const [messageCount, setMessageCount] = useState(0);
  const [todos, setTodos] = useState(Array<Todo>());
  const [adding, setAdding] = useState(true);
  const { value, model, field, invalid, submit, read, clear } = useForm(TodoModel, { onSubmit: submitTodo });

  useEffect(() => {
    (async () => {
      setTodos(await TodoEndpoint.findAll());
      if (!subscription) {
        setSubscription(
          EventEndpoint.getEventsCancellable().onNext((event) => {
            if (event.messageType == MessageType.EDITING) {
              Notification.show(event.data, { theme: 'warning' });
            } else {
              Notification.show(event.data, { theme: 'success' });
            }
            setTimeout(async () => {
              // This will trigger useEffect again and fetch all todos
              // when the notification is shown.
              setMessageCount((count) => count + 1);
              setTodos(await TodoEndpoint.findAll());
            }, 3000);
          })
        );
      }
    })();
    return () => {
      subscription?.cancel();
    };
  }, []);

  // Collect done Todos and request to remove from the database using TodoEndpoint.remove
  async function remove(): Promise<void> {
    const dones = todos.filter((todo) => todo.done);
    await TodoEndpoint.remove(dones);
    const notDone = todos.filter((todo) => !todo.done);
    setTodos(notDone);
  }

  async function submitTodo(todo: Todo) {
    var saved: Todo | undefined;
    try {
      saved = await TodoEndpoint.save(todo);
    } catch (e) {
      handleError(e);
      return;
    }
    if (saved) {
      const newTodo = saved;
      if (adding) {
        setTodos([...todos, newTodo]);
      } else {
        setTodos(todos.map((item) => (item.id === newTodo.id ? newTodo : item)));
      }
    }
  }

  function edit(todo: Todo) {
    setAdding(false);
    read(todo);
    const id = todo.id ? todo.id : 0;
    const message: Message = {
      id: id,
      data: 'Some one is editing ' + todo.task,
      messageType: MessageType.EDITING,
    };
    EventEndpoint.send(message);
  }

  function addNew() {
    setAdding(true);
    clear();
  }

  // Update status of the Todo, this function is passed down to TodoItem via TodoGrid
  async function changeStatus(todo: Todo, done: boolean | undefined): Promise<void> {
    const isDone = done ? done : false;
    const newTodo = { ...todo, done: isDone };
    const saved = (await TodoEndpoint.save(newTodo)) ?? newTodo;
    setTodos(todos.map((item) => (item.id === todo.id ? saved : item)));
  }

  return [todos, adding, model, value, remove, addNew, changeStatus, edit, submit, field, invalid] as const;
}

// Handle errors from the backend, which are thrown as EndpointError with JSON message.
// Backend performs validation.
function handleError(e: unknown) {
  if (e instanceof EndpointError) {
    const json = JSON.parse(e.message);
    if (json.type == 'dev.hilla.exception.EndpointException') {
      Notification.show(json.message, { theme: 'error' });
      return;
    }
  }
  Notification.show('Error in saving', { theme: 'error' });
}
