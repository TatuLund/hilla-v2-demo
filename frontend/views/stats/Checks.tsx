import { CheckboxGroup } from '@vaadin/react-components/CheckboxGroup.js';
import { Checkbox } from '@vaadin/react-components/Checkbox.js';
import { Select, SelectItem, SelectRenderer } from '@vaadin/react-components/Select.js';
import { Icon } from '@vaadin/react-components/Icon.js';

export default function Checks(): JSX.Element {
  const items: SelectItem[] = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
  ];

  const renderer: SelectRenderer = (original: SelectItem) => {
    return <span className="text-primary">{original.label}</span>;
  };

  return (
    <>
      <Select
        renderer={({ original }) => <span className="text-primary">{original.label}</span>}
        items={items}
        label=""
        theme="vertical"
      ></Select>
      <CheckboxGroup label="Please select the purpose for accessing the data" theme="vertical">
        {' '}
        ​
        <span>
          <Checkbox value="0" label="Scientific Analysis for internal use" />
          <Icon icon="vaadin:info"></Icon>
        </span>
        <span>
          <Checkbox value="1" label="Internal - Data Engineering" />
          <Icon icon="vaadin:info"></Icon>
        </span>
        <span>
          <Checkbox value="2" label="Data Product Development for internal use" />
          <Icon icon="vaadin:info"></Icon>
        </span>
      </CheckboxGroup>
    </>
  );
}
