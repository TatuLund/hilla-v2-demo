import { Grid } from '@hilla/react-components/Grid.js';
import { GridDataProviderCallback, GridDataProviderParams } from '@vaadin/grid';
import { GridColumn } from '@hilla/react-components/GridColumn.js';
import Contact from 'Frontend/generated/com/example/application/Contact';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { ContactEndpoint } from 'Frontend/generated/endpoints';
import { TextField } from '@hilla/react-components/TextField.js';
import { Button } from '@hilla/react-components/Button.js';
import { useMemo, useState } from 'react';

type Props = {
  opened: boolean;
  onAssignContact: (contact: Contact | undefined) => void;
};

// Show Grid in the dialog to choose a contact.
// DataProvider is used for paging the Grid with virtual scrolling from ContactEndpoint
export function ContactDialog({ opened, onAssignContact }: Props): JSX.Element {
  const [assigned, setAssigned] = useState<Contact[]>([]);
  const [filter, setFilter] = useState('');

  // if the filter changes, useMemo will re-run the callback and return the new dataProvider,
  // otherwise the previous cached value will be used.
  const dataProvider = useMemo(
    () => async (params: GridDataProviderParams<Contact>, callback: GridDataProviderCallback<Contact>) => {
      const page = await ContactEndpoint.getPage(params.page, params.pageSize, filter);
      if (page) {
        callback(page.content, page.size);
      }
    },
    [filter]
  );

  function assignTodo(value: Contact | undefined) {
    onAssignContact(value);
  }

  return (
    <>
      <Dialog
        opened={opened}
        header={<h3 className="m-0">Assign Todo</h3>}
        onOpenedChanged={({ detail: { value } }) => setFilter('')}
        footer={
          <div className="flex gap-m w-full">
            <TextField
              className="mr-auto"
              placeholder="Filter"
              value={filter}
              onValueChanged={({ detail: { value } }) => setFilter(value)}
            ></TextField>
            <Button theme="secondary" onClick={() => assignTodo(undefined)}>
              Cancel
            </Button>
            <Button theme="primary" disabled={assigned.length == 0} onClick={() => assignTodo(assigned[0])}>
              Assign
            </Button>
          </div>
        }
      >
        <Grid
          style={{ minWidth: '900px' }}
          selectedItems={assigned}
          onActiveItemChanged={({ detail: { value } }) => setAssigned(value ? [value] : [])}
          dataProvider={dataProvider}
        >
          <GridColumn
            header="Name"
            renderer={({ item }) => <span>{item.firstName.toUpperCase() + ' ' + item.lastName}</span>}
          ></GridColumn>
          <GridColumn path="email"></GridColumn>
          <GridColumn path="date"></GridColumn>
        </Grid>
      </Dialog>
    </>
  );
}
