import { DetailedHTMLProps } from 'react';

type BadgeType = 'badge' | 'badge primary' | 'badge success' | 'badge error' | 'badge warning';

/**
 * Props for the Badge component.
 */
interface BadgeProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  /**
   * The ID of the badge.
   */
  id?: string;
  /**
   * The type of the badge.
   */
  type?: BadgeType;
  /**
   * The text content of the badge.
   */
  text?: string;
}

/**
 * Renders a badge component.
 *
 * @param {BadgeProps} props - The props for the badge component.
 * @returns {JSX.Element} The rendered badge component.
 */
export default function Badge(props: BadgeProps): JSX.Element {
  // Lumo contains styles for Badge, this is simple component for Badge
  return (
    <span id={props.id} className={props.className} {...{ theme: props.type }}>
      {props.text}
    </span>
  );
}
