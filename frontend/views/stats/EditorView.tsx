import { Grid } from '@hilla/react-components/Grid.js';
import { GridColumn } from '@hilla/react-components/GridColumn.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { Button } from '@hilla/react-components/Button.js';
import { useState } from 'react';
import { IntegerField } from '@hilla/react-components/IntegerField.js';
import { DatePicker } from '@hilla/react-components/DatePicker.js';
import { Item } from '@hilla/react-components/Item.js';

export default function EditorView(): JSX.Element {
  const [gridVisible, setGridVisible] = useState(true);

  return (
    <>
      <Button onClick={() => setGridVisible(!gridVisible)}>{gridVisible ? 'Hide' : 'Show'}</Button>
      <EditorGrid visible={gridVisible}></EditorGrid>
    </>
  );
}

type Item = {
  id: number;
  name: string;
  age: number;
  date: Date;
};

type Props = {
  visible: boolean;
};

export function EditorGrid({ visible }: Props): JSX.Element {
  const [editorEnabled, setEditorEnabled] = useState(-1);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Peter', age: 20, date: new Date() },
    { id: 2, name: 'Jane', age: 30, date: new Date() },
    { id: 3, name: 'Tom', age: 40, date: new Date() },
  ]);

  function updateItem(item: Item | null) {
    if (item) {
      console.log('Saved: ' + item.name + '/' + item.age);
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      setEditorEnabled(-1);
    }
  }

  return (
    <div hidden={!visible}>
      <Grid items={items}>
        <GridColumn<Item>
          header="Name"
          renderer={({ item }) => {
            const name = 'name';
            return editorEnabled == item.id ? (
              <TextField
                style={{ width: '100%' }}
                onChange={(e) => updateItem({ ...item, [name]: e.target.value })}
                value={item[name]}
              ></TextField>
            ) : (
              <span>{item[name]}</span>
            );
          }}
        ></GridColumn>
        <GridColumn<Item>
          header="Age"
          renderer={({ item }) => {
            return editorEnabled == item.id ? (
              <IntegerField
                style={{ width: '100%' }}
                onChange={(e) => updateItem({ ...item, age: parseInt(e.target.value) })}
                value={item.age.toFixed()}
              ></IntegerField>
            ) : (
              <span>{item.age}</span>
            );
          }}
        ></GridColumn>
        <GridColumn<Item>
          header="Date"
          renderer={({ item }) => {
            return editorEnabled == item.id ? (
              <DatePicker
                style={{ width: '100%' }}
                onChange={(e) => updateItem({ ...item, date: new Date(e.target.value) })}
                value={item.date.toISOString().substring(0, 10)}
              ></DatePicker>
            ) : (
              <span>{item.date.toISOString().substring(0, 10)}</span>
            );
          }}
        ></GridColumn>
        <GridColumn
          header="Edit"
          renderer={({ item }) => (
            <div>
              <Button
                onClick={(e) => {
                  item.id == editorEnabled ? updateItem(null) : setEditorEnabled(item.id);
                }}
              >
                {item.id == editorEnabled ? 'Save' : 'Edit'}
              </Button>
              <Button onClick={(e) => setItems(items.filter((i) => i.id != item.id))}>Delete</Button>
            </div>
          )}
        ></GridColumn>
      </Grid>
    </div>
  );
}
