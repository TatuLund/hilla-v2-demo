import { DetailedHTMLProps } from 'react';

type BadgeType = 'badge' | 'badge primary' | 'badge success' | 'badge error' | 'badge warning';

interface BadgeProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  id?: string;
  type?: BadgeType;
  text?: string;
}

// Lumo contains styles for Badge, this is simple component for Badge
export default function Badge(props: BadgeProps): JSX.Element {
  return (
    <span id={props.id} className={props.className} {...{ theme: props.type }}>
      {props.text}
    </span>
  );
}
