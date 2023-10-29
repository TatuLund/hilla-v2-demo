import { Grid, GridSorterDirection } from '@hilla/react-components/Grid.js';
import { GridDataProviderCallback, GridDataProviderParams } from '@vaadin/grid';
import { GridColumn } from '@hilla/react-components/GridColumn.js';
import { GridSortColumn } from '@hilla/react-components/GridSortColumn.js';
import Contact from 'Frontend/generated/com/example/application/data/Contact';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { ContactEndpoint } from 'Frontend/generated/endpoints';
import { TextField } from '@hilla/react-components/TextField.js';
import { Button } from '@hilla/react-components/Button.js';
import { useCallback, useState } from 'react';
import { Grid as GridComponent } from '@vaadin/grid';

type Props = {
  opened: boolean;
  onAssignContact: (contact: Contact | undefined) => void;
};

// Wrap callback in useCallback to avoid re-creating the callback on every render of
// the component. And use custom hook to wrap the dataProvider with filter and direction.
function useDataProvider() {
  const [filter, setFilter] = useState('');
  const [direction, setDirection] = useState<GridSorterDirection>('desc');

  // if the filter or direction changes, useCallback will re-run the callback and return
  // the new dataProvider, otherwise the previous cached value will be used.
  const dataProvider = useCallback(
    async (params: GridDataProviderParams<Contact>, callback: GridDataProviderCallback<Contact>) => {
      let dir: string | undefined = undefined;
      if (direction == 'asc') {
        dir = 'asc';
      } else if (direction == 'desc') {
        dir = 'desc';
      }
      const page = await ContactEndpoint.getPage(params.page, params.pageSize, filter, dir);
      if (page) {
        callback(page.content, page.size);
      }
    },
    [filter, direction]
  );

  return [dataProvider, filter, setFilter, direction, setDirection] as const;
}

function addTooltipToColumn(grid: GridComponent<Contact> | null, column: number) {
  // Add tooltip to the sorter column using plain JS
  const sorter = grid?.getElementsByTagName('vaadin-grid-sorter')[column];
  sorter?.setAttribute('id', 'sorter');
  const tooltip = document.createElement('vaadin-tooltip');
  tooltip.setAttribute('for', 'sorter');
  tooltip.setAttribute('text', 'Sort by last name and first name');
  sorter?.parentElement?.appendChild(tooltip);
}

// Show Grid in the dialog to choose a contact.
// DataProvider is used for paging the Grid with virtual scrolling from ContactEndpoint
export function ContactDialog({ opened, onAssignContact }: Props): JSX.Element {
  const [assigned, setAssigned] = useState<Contact[]>([]);
  const [dataProvider, filter, setFilter, direction, setDirection] = useDataProvider();

  function assignTodo(value: Contact | undefined) {
    onAssignContact(value);
  }

  function FooterCotent() {
    return (
      <div className="flex gap-m w-full">
        <TextField
          className="mr-auto"
          placeholder="Filter by e-mail"
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
    );
  }

  return (
    <>
      <Dialog
        opened={opened}
        header={<h3 className="m-0">Assign Todo</h3>}
        onOpenedChanged={({ detail: { value } }) => setFilter('')}
        footer={<FooterCotent />}
      >
        <Grid<Contact>
          ref={(element) => {
            setTimeout(() => {
              // Use setTimeout to wait for the Grid to be rendered
              addTooltipToColumn(element, 0);
            }, 100);
          }}
          style={{ minWidth: '900px' }}
          selectedItems={assigned}
          onActiveItemChanged={({ detail: { value } }) => setAssigned(value ? [value] : [])}
          dataProvider={dataProvider}
        >
          <GridSortColumn<Contact>
            direction={direction}
            // Use setDirection to change the direction of the sorter and trigger the dataProvider
            onDirectionChanged={(e) => setDirection(e.detail.value)}
            header="Name"
            renderer={({ item }) => <span>{item.firstName.toUpperCase() + ' ' + item.lastName}</span>}
          ></GridSortColumn>
          <GridColumn path="email"></GridColumn>
          <GridColumn path="date"></GridColumn>
        </Grid>
      </Dialog>
    </>
  );
}
