import 'Frontend/app-export.js';

type TodoProps = Readonly<{
  name?: string;
}>;

export default function TodoViewWc(props : TodoProps): JSX.Element {
  return (
    <div
      ref={(element) => {
        // setTimeout(() => {
        if (element) element.innerHTML = `<app-export name="${props.name}"></app-export>`;
        // }, 10);
      }}
    ></div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hello-world': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export function HelloWorld(): JSX.Element {
  return <hello-world></hello-world>;
}
