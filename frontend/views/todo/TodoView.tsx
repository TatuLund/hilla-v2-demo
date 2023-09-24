import type Contact from 'Frontend/generated/com/example/application/Contact';
import { FormLayout } from '@hilla/react-components/FormLayout.js';
import { ComboBox } from '@hilla/react-components/ComboBox.js';
import { TextArea } from '@hilla/react-components/TextArea.js';
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

export default function TodoView(): JSX.Element {
  const [todos, adding, model, value, remove, addNew, changeStatus, edit, submit, field, invalid] = useTodos();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [assigned, setAssigned] = useState<Contact>();
  const presets = ['Make food', 'Clean the house', 'Do the groceries', 'Mow the lawn', 'Walk the dog'];

  function noDone(): boolean {
    return todos.filter((todo) => todo.done).length == 0;
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
      <div className="h-full flex flex-col">
        <div className="grid gap-m shadow-s m-m p-s">
          <Button style={{ width: '60px' }} id="new" onClick={() => addNew()}>
            <Icon icon="vaadin:plus"></Icon>
            <Tooltip position="end-bottom" slot="tooltip" text="Add new todo"></Tooltip>
          </Button>
          <FormLayout>
            <ComboBox label="Task" allowCustomValue items={presets} {...field(model.task)}></ComboBox>
            <TextArea label="Description" {...field(model.description)} />
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
        <div className="flex flex-col m-m shadow-s p-s flex-grow">
          <TodoGrid todos={todos} onClick={edit} onChangeStatus={(todo, value) => changeStatus(todo, value)}></TodoGrid>
          <Button theme="error" className="mt-m" disabled={noDone()} onClick={remove}>
            Remove<Tooltip position="end-bottom" slot="tooltip" text="Remove todos that are done"></Tooltip>
          </Button>
        </div>
      </div>
    </>
  );
}
