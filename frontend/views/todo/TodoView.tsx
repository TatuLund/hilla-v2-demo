import type Todo from 'Frontend/generated/com/example/application/Todo';
import type Contact from 'Frontend/generated/com/example/application/Contact';
import { useEffect, useState } from 'react';
import { useForm } from '@hilla/react-form';
import { EventEndpoint, TodoEndpoint } from 'Frontend/generated/endpoints';
import { EndpointError, Subscription } from '@hilla/frontend';
import { FormLayout } from '@hilla/react-components/FormLayout.js';
import { ComboBox } from '@hilla/react-components/ComboBox.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { Icon } from '@hilla/react-components/Icon.js';
import '@vaadin/icons';
import { IntegerField } from '@hilla/react-components/IntegerField.js';
import { Button } from '@hilla/react-components/Button.js';
import { Tooltip } from '@hilla/react-components/Tooltip.js';
import { TodoGrid } from './TodoGrid';
import { ContactDialog } from './ContactDialog';
import { Notification } from '@hilla/react-components/Notification.js';
import Message from 'Frontend/generated/com/example/application/EventService/Message';
import TodoModel from 'Frontend/generated/com/example/application/TodoModel';
import { LocalizedDatePicker } from '../../components/localizeddatepicker/LocalizedDatePicker';

// Use custom hook to fetch all todos from TodoEndpoint.findAll.
// Also subscribe to EventEndpoint.getEventsCancellable to get notifications from the backend.
function useTodos() {
  const [subscription, setSubscription] = useState<Subscription<Message>>();
  const [saveCount, setSaveCount] = useState(0);
  const [todos, setTodos] = useState(Array<Todo>());

  useEffect(() => {
    (async () => {
      setTodos(await TodoEndpoint.findAll());
      if (!subscription) {
        setSubscription(
          EventEndpoint.getEventsCancellable().onNext((event) => {
            Notification.show(event.data, { theme: 'success' });
            setTimeout(() => {
              // This will trigger useEffect again and fetch all todos 
              // when the notification is shown.
              setSaveCount((count) => count + 1);
            }, 3000);
          })
        );
      }
    })();
    return () => {
      subscription?.cancel();
    };
  }, [saveCount]);

  return [todos, setTodos] as const;
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

export default function TodoView(): JSX.Element {
  const [todos, setTodos] = useTodos();
  const empty: Todo = { task: '', done: false };
  const [dialogOpened, setDialogOpened] = useState(false);
  const [adding, setAdding] = useState(true);
  const [assigned, setAssigned] = useState<Contact>();
  const presets = ['Make food', 'Clean the house', 'Do the groceries', 'Mow the lawn', 'Walk the dog'];
  const { value, model, field, invalid, submit, read } = useForm(TodoModel, { onSubmit: submitTodo });

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
  }

  function addNew(todo: Todo) {
    setAdding(true);
    read(empty);
  }

  // Update status of the Todo, this function is passed down to TodoItem via TodoGrid
  async function changeStatus(todo: Todo, done: boolean | undefined): Promise<void> {
    const isDone = done ? done : false;
    const newTodo = { ...todo, done: isDone };
    const saved = (await TodoEndpoint.save(newTodo)) ?? newTodo;
    setTodos(todos.map((item) => (item.id === todo.id ? saved : item)));
  }

  function noDone(): boolean {
    return todos.filter((todo) => todo.done).length == 0;
  }

  // Collect done Todos and request to remove from the database using TodoEndpoint.remove
  async function remove(): Promise<void> {
    const dones = todos.filter((todo) => todo.done);
    await TodoEndpoint.remove(dones);
    const notDone = todos.filter((todo) => !todo.done);
    setTodos(notDone);
  }

  function assignTodo(contact: Contact | undefined) {
    if (value) {
      value.assigned = contact;
      setAssigned(assigned);
      setDialogOpened(false);
    } else {
      setDialogOpened(false);
    }
  }

  function FormButtons() {
    return (
      <>
        <div className="flex">
          <Button onClick={() => setDialogOpened(!dialogOpened)}>
            {assigned ? assigned.firstName + ' ' + assigned.lastName : 'Assign'}
          </Button>
          <Button id="add" className="ml-auto" theme="primary" disabled={invalid} onClick={submit}>
            {adding ? 'Add' : 'Update'}
          </Button>
        </div>
      </>
    );
  }

  // Use useForm to bind the fields with ...field directive.
  return (
    <>
      <div className="grid gap-m shadow-s m-m p-s">
        <Button style={{ width: '60px' }} id="new" onClick={() => addNew(empty)}>
          <Icon icon="vaadin:plus"></Icon>
        </Button>
        <FormLayout>
          <ComboBox label="Task" allowCustomValue items={presets} {...field(model.task)}></ComboBox>
          <TextField label="Description" {...field(model.description)} />
          <IntegerField label="Priority" stepButtonsVisible theme="align-right" {...field(model.priority)} />
          <LocalizedDatePicker
            autoselect
            autoOpenDisabled
            label="Deadline"
            language="fi"
            helperText="Finnish format"
            {...field(model.deadline)}
          />
        </FormLayout>
        <ContactDialog opened={dialogOpened} onAssignContact={assignTodo}></ContactDialog>
        <FormButtons />
      </div>
      <div className="m-m shadow-s p-s">
        <TodoGrid todos={todos} onClick={edit} onChangeStatus={(todo, value) => changeStatus(todo, value)}></TodoGrid>
        <Button theme="error" className="mt-m" disabled={noDone()} onClick={remove}>
          Remove<Tooltip position="end-bottom" slot="tooltip" text="Remove todos that are done"></Tooltip>
        </Button>
      </div>
    </>
  );
}
