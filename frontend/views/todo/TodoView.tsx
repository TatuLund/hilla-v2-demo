import type Contact from 'Frontend/generated/com/example/application/data/Contact';
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
import { LocalizedDatePicker } from '../../components/localizeddatepicker/LocalizedDatePicker';
import { useState } from 'react';
import { useTodos } from './useTodos';
import { useAuth } from 'Frontend/auth';
import FormButtons from './FormButtons';

export default function TodoView(): JSX.Element {
  const [todos, adding, model, value, remove, addNew, changeStatus, edit, submit, field, invalid] = useTodos();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [assigned, setAssigned] = useState<Contact>();
  const { hasAccess } = useAuth();
  const presets = ['Make food', 'Clean the house', 'Do the groceries', 'Mow the lawn', 'Walk the dog'];

  /**
   * Checks if there are no todos marked as done.
   * @returns {boolean} True if there are no todos marked as done, false otherwise.
   */
  function noDone(): boolean {
    return todos.filter((todo) => todo.done).length == 0;
  }

  /**
   * Assigns a contact to a todo.
   *
   * @param {Contact | undefined} contact - The contact to assign to the todo. Use `undefined` to remove the assigned contact.
   */
  function assignTodo(contact: Contact | undefined) {
    if (value) {
      value.assigned = contact;
      setAssigned(assigned);
      setDialogOpened(false);
    } else {
      setDialogOpened(false);
    }
  }

  // Use useForm to bind the fields with ...field directive.
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="grid gap-m shadow-s m-m p-s">
          <Button style={{ width: '60px' }} id="new" onClick={() => addNew()}>
            <Icon icon="vaadin:plus"></Icon>
            <Tooltip position="end-bottom" slot="tooltip" text="Add a new todo"></Tooltip>
          </Button>
          <FormLayout>
            <ComboBox<string> label="Task" allowCustomValue items={presets} {...field(model.task)}></ComboBox>
            <TextField autocomplete="off" label="Description" {...field(model.description)} />
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
          <FormButtons
            adding={adding}
            assigned={assigned}
            invalid={invalid}
            onAssign={() => setDialogOpened(!dialogOpened)}
            onSave={submit}
          />
        </div>
        <div className="flex flex-col m-m shadow-s p-s flex-grow">
          <TodoGrid current={value} todos={todos} onClick={edit} onChangeStatus={(todo, value) => changeStatus(todo, value)}></TodoGrid>
          <Button
            style={{ alignSelf: 'start' }}
            theme="error"
            className="mt-m"
            disabled={noDone() || !hasAccess({ rolesAllowed: ['ROLE_ADMIN'] })}
            onClick={remove}
          >
            <Icon icon="vaadin:trash"></Icon>
            <Tooltip position="end-bottom" slot="tooltip" text="Remove todos that are done"></Tooltip>
          </Button>
        </div>
      </div>
    </>
  );
}
