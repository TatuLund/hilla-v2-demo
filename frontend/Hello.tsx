type Props = {
    name : string;
};

export default function Hello({ name } : Props): JSX.Element {
  return <h1 data-testid="hello-h1">Hello {name}</h1>;
}
