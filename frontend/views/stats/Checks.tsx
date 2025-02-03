import { CheckboxGroup } from '@vaadin/react-components/CheckboxGroup.js';
import { Checkbox } from '@vaadin/react-components/Checkbox.js';
import { Icon } from '@vaadin/react-components/Icon.js';

export default function Checks(): JSX.Element {
  return (
    <CheckboxGroup label="Please select the purpose for accessing the data" theme="vertical">
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
  );
}
