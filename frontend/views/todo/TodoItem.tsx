import type Todo from 'Frontend/generated/com/example/application/Todo';
import { Checkbox } from '@hilla/react-components/Checkbox.js';
import { Tooltip } from '@hilla/react-components/Tooltip.js';
import Badge from 'Frontend/components/badge/Badge';

type Props = {
  todo: Todo;
  onChangeStatus: (todo: Todo, value: boolean | undefined) => void;
  onClick: (todo: Todo) => void;
};

// TodoItem is used in TodoGrid, this produces one row for TodoGrid
export function TodoItem({ todo, onChangeStatus, onClick }: Props): JSX.Element {
  return (
    <>
      <Checkbox checked={todo.done} onCheckedChanged={({ detail: { value } }) => onChangeStatus(todo, value)}>
        <Tooltip position="start" slot="tooltip" text="Done"></Tooltip>
      </Checkbox>
      <span id={'task-' + todo.id} onClick={(e) => onClick(todo)} className="text-primary text-l font-bold">
        {todo.task}
      </span>
      <Tooltip position="start-bottom" for={'task-' + todo.id} text="Edit me"></Tooltip>
      <span>{todo.description}</span>
      <span>{todo.assigned?.firstName + ' ' + todo.assigned?.lastName}</span>
      <span>{todo.deadline}</span>
      <Badge
        type={todo.priority == 5 ? 'badge primary' : 'badge'}
        id={'badge-' + todo.id}
        className="text-s ml-auto"
        text={'' + todo.priority}
      ></Badge>
      <Tooltip position="end-bottom" for={'badge-' + todo.id} text="Priority"></Tooltip>
    </>
  );
}
