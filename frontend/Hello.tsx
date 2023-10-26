import { useState } from 'react';

type Props = {
    name : string;
};

export default function Hello({ name } : Props): JSX.Element {
  const [editorEnabled, setEditorEnabled] = useState();

  return <div>
    <h1 data-testid="hello-h1">Hello {name}</h1>;
    </div>
}
