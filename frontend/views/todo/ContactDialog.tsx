import { Grid, GridSorterDirection } from '@vaadin/react-components/Grid.js';
import { GridDataProviderCallback, GridDataProviderParams, Grid as GridComponent } from '@vaadin/grid';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { GridSortColumn } from '@vaadin/react-components/GridSortColumn.js';
import Contact from 'Frontend/generated/com/example/application/data/Contact';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { ContactEndpoint } from 'Frontend/generated/endpoints';
import { TextField } from '@vaadin/react-components/TextField.js';
import { Button } from '@vaadin/react-components/Button.js';
import { useCallback } from 'react';
import { Icon } from '@vaadin/react-components/Icon.js';
import { useSignal } from '@vaadin/hilla-react-signals';

/**
 * Props for the ContactDialog component.
 */
type Props = Readonly<{
  opened: boolean;
  onAssignContact: (contact: Contact | undefined) => void;
}>;

/**
 * Custom hook that provides a data provider function for fetching contact data.
 * The data provider is wrapped with filter and direction functionality.
 *
 * @returns An array containing the data provider function, filter value, filter setter,
 * direction value, and direction setter.
 */
function useDataProvider() {
  // Wrap callback in useCallback to avoid re-creating the callback on every render of
  // the component. And use custom hook to wrap the dataProvider with filter and direction.
  const filter = useSignal('');
  const direction = useSignal<GridSorterDirection>('desc');

  // if the filter or direction changes, useCallback will re-run the callback and return
  // the new dataProvider, otherwise the previous cached value will be used.
  const dataProvider = useCallback(
    async (params: GridDataProviderParams<Contact>, callback: GridDataProviderCallback<Contact>) => {
      let dir: string | undefined = undefined;
      if (direction.value == 'asc') {
        dir = 'asc';
      } else if (direction.value == 'desc') {
        dir = 'desc';
      }
      const page = await ContactEndpoint.getPage(params.page, params.pageSize, filter.value, dir);
      if (page) {
        callback(page.content, page.size);
      }
    },
    [filter, direction]
  );

  return [dataProvider, filter, direction] as const;
}

/**
 * Adds a tooltip to a specific column in a grid.
 *
 * @param grid - The grid component.
 * @param column - The index of the column to add the tooltip to.
 */
function addTooltipToColumn(grid: GridComponent<Contact> | null, column: number) {
  // Add tooltip to the sorter column using plain JS
  const sorter = grid?.getElementsByTagName('vaadin-grid-sorter')[column];
  sorter?.setAttribute('id', 'sorter');
  const tooltip = document.createElement('vaadin-tooltip');
  tooltip.setAttribute('for', 'sorter');
  tooltip.setAttribute('text', 'Sort by last name and first name');
  sorter?.parentElement?.appendChild(tooltip);
}

/**
 * Renders a dialog for assigning a contact to a todo.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.opened - Indicates whether the dialog is opened or not.
 * @param {Function} props.onAssignContact - The function to be called when a contact is assigned.
 * @returns {JSX.Element} The rendered ContactDialog component.
 */
export default function ContactDialog({ opened, onAssignContact }: Props): JSX.Element {
  const assigned = useSignal<Contact[]>([]);
  const [dataProvider, filter, direction] = useDataProvider();

  function assignTodo(value: Contact | undefined) {
    onAssignContact(value);
  }

  /**
   * Renders the footer content for the ContactDialog component.
   *
   * @returns The JSX element representing the footer content.
   */
  function FooterCotent() {
    return (
      <div className="flex gap-m w-full">
        <Button className="ml-auto" theme="secondary" onClick={() => assignTodo(undefined)}>
          Cancel
        </Button>
        <Button theme="primary" disabled={assigned.value.length == 0} onClick={() => assignTodo(assigned.value[0])}>
          Assign
        </Button>
      </div>
    );
  }

  // Show Grid in the dialog to choose a contact.
  // DataProvider is used for paging the Grid with virtual scrolling from ContactEndpoint
  return (
    <Dialog
      opened={opened}
      header={<h3 className="m-0">Assign Todo</h3>}
      onOpenedChanged={({ detail: { value } }) => filter.value = ''}  
      footer={<FooterCotent />}
    >
      <TextField
        className="mr-auto uppercase"
        placeholder="Filter by e-mail"
        value={filter.value}
        autoFocus={true}
        autoselect={true}
        onChange={(e) => filter.value = e.target.value}
      >
        <Icon slot="suffix" icon="vaadin:search"></Icon>
      </TextField>
      <Grid<Contact>
        ref={(element) => {
          setTimeout(() => {
            // Use setTimeout to wait for the Grid to be rendered
            addTooltipToColumn(element, 0);
          }, 100);
        }}
        style={{ minWidth: '900px' }}
        selectedItems={assigned.value}
        theme="column-borders row-stripes"
        onActiveItemChanged={({ detail: { value } }) => assigned.value = value ? [value] : []}
        dataProvider={dataProvider}
      >
        <GridSortColumn<Contact>
          direction={direction.value}
          // Use setDirection to change the direction of the sorter and trigger the dataProvider
          onDirectionChanged={(e) => direction.value = e.detail.value}
          header="Name"
          renderer={({ item }) => <span>{item.firstName.toUpperCase() + ' ' + item.lastName}</span>}
        ></GridSortColumn>
        <GridColumn path="email"></GridColumn>
        <GridColumn path="date"></GridColumn>
      </Grid>
    </Dialog>
  );
}
