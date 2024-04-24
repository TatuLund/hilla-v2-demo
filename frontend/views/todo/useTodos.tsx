import { useEffect, useState } from 'react';
import { useForm, useFormPart } from '@hilla/react-form';
import { EventEndpoint, TodoEndpoint, UserInfoService } from 'Frontend/generated/endpoints';
import { EndpointError, Subscription } from '@hilla/frontend';
import type Todo from 'Frontend/generated/com/example/application/data/Todo';
import { Notification } from '@hilla/react-components/Notification.js';
import Message from 'Frontend/generated/com/example/application/services/EventService/Message';
import TodoModel from 'Frontend/generated/com/example/application/data/TodoModel';
import MessageType from 'Frontend/generated/com/example/application/services/EventService/MessageType';
import UserInfo from 'Frontend/generated/com/example/application/services/UserInfo';
import { FutureWeekdayAndRequired } from '../data/validators';
import { ConnectionState, ConnectionStateStore } from '@vaadin/common-frontend';

// Use custom hook to fetch all todos from TodoEndpoint.findAll.
// Also subscribe to EventEndpoint.getEventsCancellable to get notifications from the backend.
// This hook is used in TodoView and wraps the model data and functions in an array.

/**
 * Custom hook for managing todos.
 *
 * @returns An arry containing the following values in order:
 * - todos: An array of Todo objects.
 * - adding: A boolean indicating whether a new todo is being added.
 * - model: The form model for creating/editing todos.
 * - value: The current form values as a Todo object.
 * - remove: A function to remove completed todos from the database.
 * - addNew: A function to start adding a new todo.
 * - changeStatus: A function to update the status of a todo.
 * - edit: A function to start editing a todo.
 * - submit: A function to submit the form and save a todo.
 * - field: The form field object.
 * - invalid: A boolean indicating whether the form is invalid.
 */
export function useTodos() {
  const [subscription, setSubscription] = useState<Subscription<Message>>();
  const [todos, setTodos] = useState(Array<Todo>());
  const [adding, setAdding] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { value, model, field, invalid, submit, read, clear } = useForm(TodoModel, { onSubmit: submitTodo });
  const dateField = useFormPart(model.deadline);
  const [offline, setOffline] = useState(false);
  var connectionStateStore: ConnectionStateStore | undefined;

  // Listen connection state changes
  const connectionStateListener = () => {
    setOffline(connectionStateStore?.state === ConnectionState.CONNECTION_LOST);
  };

  function setupOfflineListener() {
    const $wnd = window as any;
    if ($wnd.Vaadin?.connectionState) {
      connectionStateStore = $wnd.Vaadin.connectionState as ConnectionStateStore;
      connectionStateStore.addStateChangeListener(connectionStateListener);
      connectionStateListener();
    }
  }

  useEffect(() => {
    (async () => {
      setupOfflineListener();
      dateField.addValidator(new FutureWeekdayAndRequired());
      clearForm();
      if (connectionStateStore?.state === ConnectionState.CONNECTION_LOST) {
        setTodos(JSON.parse(localStorage.getItem('todos') || '[]'));
      } else {
        const fetched = await TodoEndpoint.findAll();
        setTodos(fetched);
        localStorage.setItem('todos', JSON.stringify(fetched));
        setUserInfo(await UserInfoService.getUserInfo());
        subscribeEventEndpoint();
      }
    })();
    return () => {
      subscription?.cancel();
    };
  }, []);

  function subscribeEventEndpoint() {
    if (!subscription) {
      setSubscription(EventEndpoint.getEventsCancellable().onNext(onMessage));
    }
  }

  function onMessage(event: Message) {
    if (event.messageType == MessageType.EDITING) {
      Notification.show(event.data, { theme: 'warning' });
    } else {
      Notification.show(event.data, { theme: 'success' });
      setTimeout(async () => {
        // Wait 3 seconds before updating the list of todos
        setTodos(await TodoEndpoint.findAll());
      }, 3000);
    }
  }

  /**
   * Removes the done todos from the database and updates the todos state.
   * @returns A promise that resolves when the removal is complete.
   */
  async function remove(): Promise<void> {
    // Collect done Todos and request to remove from the database using TodoEndpoint.remove
    const dones = todos.filter((todo) => todo.done);
    await TodoEndpoint.remove(dones);
    const notDone = todos.filter((todo) => !todo.done);
    setTodos(notDone);
  }

  /**
   * Submits a todo for saving.
   * @param todo The todo to be saved.
   */
  async function submitTodo(todo: Todo) {
    var saved: Todo | undefined;
    try {
      saved = await TodoEndpoint.save(todo);
    } catch (error) {
      handleError(error);
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

  /**
   * Edits a todo.
   * @param todo - The todo to be edited.
   */
  function edit(todo: Todo) {
    setAdding(false);
    read(todo);
    const id = todo.id ? todo.id : 0;
    const message: Message = {
      id: id,
      data: userInfo?.fullName + ' (' + userInfo?.name + ') is editing "' + todo.task + '"',
      messageType: MessageType.EDITING,
    };
    EventEndpoint.send(message);
  }

  /**
   * Sets the state of adding to true and clears the input fields.
   */
  function addNew() {
    setAdding(true);
    clearForm;
    // clear(); // read(TodoModel.createEmptyValue());
  }

  /**
   * Clears the form by setting the task and priority to empty values.
   * This is a workaround for a bug in the ComboBox and IntegerField components.
   * @returns void
   */
  function clearForm() {
    const empty = TodoModel.createEmptyValue();
    empty.task = ''; // ComboBox does not accept undefined
    empty.priority = 0; // IntegerField does not accept undefined
    read(empty);
  }

  /**
   * Updates the status of a todo.
   *
   * @param todo - The todo to update.
   * @param done - The new status of the todo.
   * @returns A promise that resolves when the update is complete.
   */
  async function changeStatus(todo: Todo, done: boolean | undefined): Promise<void> {
    // Update status of the Todo, this function is passed down to TodoItem via TodoGrid
    const isDone = done ? done : false;
    const newTodo = { ...todo, done: isDone };
    const saved = (await TodoEndpoint.save(newTodo)) ?? newTodo;
    setTodos(todos.map((item) => (item.id === todo.id ? saved : item)));
  }

  return [
    todos,
    adding,
    model,
    value as Todo,
    remove,
    addNew,
    changeStatus,
    edit,
    submit,
    field,
    invalid,
    offline,
  ] as const;
}

/**
 * Handles errors from the backend, which are thrown as EndpointError with JSON message.
 * Backend performs validation.
 * @param error - The error object to handle.
 */
function handleError(error: unknown) {
  // Handle errors from the backend, which are thrown as EndpointError with JSON message.
  // Backend performs validation.
  if (error instanceof EndpointError) {
    Notification.show(error.message, { theme: 'error' });
  } else {
    Notification.show('Error in saving', { theme: 'error' });
  }
}
