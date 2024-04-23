import type Todo from 'Frontend/generated/com/example/application/data/Todo';
import { Checkbox } from '@hilla/react-components/Checkbox.js';
import { Tooltip } from '@hilla/react-components/Tooltip.js';
import Badge from 'Frontend/components/badge/Badge';

type Props = {
  todo: Todo;
  onChangeStatus: (todo: Todo, value: boolean | undefined) => void;
  onClick: (todo: Todo) => void;
  readonly: boolean;
  highlight: boolean;
};

/**
 * Renders a single todo item.
 *
 * @param {Object} props - The component props.
 * @param {Todo} props.todo - The todo object.
 * @param {Function} props.onChangeStatus - The function to handle status change.
 * @param {Function} props.onClick - The function to handle click event.
 * @returns {JSX.Element} The rendered todo item.
 */
export function TodoItem({ todo, onChangeStatus, onClick, highlight, readonly }: Props): JSX.Element {
  // onCheckedChanged is called also when Checkbox value is changed programmatically
  // thus using onClick. This is a workaround for the issue. Note that the value of
  // the checkbox is not updated when clicked, thus the value is inverted.
  return (
    <>
      <Checkbox
        disabled={readonly}
        className={highlight ? 'bg-primary-10' : ''}
        checked={todo.done}
        onClick={({ currentTarget }) => onChangeStatus(todo, !currentTarget.checked)}
      >
        <Tooltip position="start" slot="tooltip" text="Done"></Tooltip>
      </Checkbox>
      <span
        tabIndex={0}
        id={'task-' + todo.id}
        onKeyDown={(e) => {
          if (e.key == ' ') {
            e.preventDefault();
            onClick(todo);
          }
        }}
        role="button"
        aria-label="Edit item"
        onClick={(e) => onClick(todo)}
        className={'text-primary text-l font-bold' + (highlight ? ' bg-primary-10' : '')}
      >
        {todo.task}
      </span>
      <Tooltip position="start-bottom" for={'task-' + todo.id} text="Edit me"></Tooltip>
      <span id={'desc-' + todo.id} className={'hidden lg:flex' + (highlight ? ' bg-primary-10' : '')}>
        <span className="block w-full whitespace-nowrap overflow-ellipsis overflow-hidden">{todo.description}</span>
        <Tooltip position="end-bottom" for={'desc-' + todo.id} text={todo.description}></Tooltip>
      </span>
      <span className={'hidden lg:flex ' + (todo.assigned ? '' : 'text-warning') + (highlight ? ' bg-primary-10' : '')}>
        {todo.assigned ? todo.assigned?.firstName + ' ' + todo.assigned?.lastName : 'unassigned'}
      </span>
      <span className={'hidden lg:flex' + (highlight ? ' bg-primary-10' : '')}>{todo.deadline}</span>
      <Badge
        type={todo.priority ? (todo.priority == 5 ? 'badge primary' : 'badge') : 'badge warning'}
        id={'badge-' + todo.id}
        className="text-s ml-auto"
        text={todo.priority ? '' + todo.priority : '-'}
      ></Badge>
      <Tooltip position="end-bottom" for={'badge-' + todo.id} text="Priority"></Tooltip>
    </>
  );
}
