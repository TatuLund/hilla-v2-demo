import type Todo from 'Frontend/generated/com/example/application/data/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  current: Todo | undefined;
  readonly: boolean;
  onChangeStatus: (todo: Todo, value: boolean | undefined) => void;
  onClick: (todo: Todo) => void;
};

/**
 * Renders a grid of todo items.
 * 
 * @param todos - The array of todo items to display.
 * @param onChangeStatus - The callback function to handle status change of a todo item.
 * @param onClick - The callback function to handle click event on a todo item.
 * @returns The JSX element representing the todo grid.
 */
export function TodoGrid({ todos, onChangeStatus, onClick, current, readonly }: Props): JSX.Element {
  // Display list of todos in CSS Grid
  return (
    <>
      <div style={{ height: '300px' }} className="p-m grid grid-cols-3 lg:grid-cols-6 gap-s overflow-auto flex-grow">
        <GridHeader />
        {todos.map((todo) => (
          <TodoItem
            readonly={readonly}
            onClick={(todo) => onClick(todo)}
            key={todo.id}
            todo={todo}
            highlight={todo.id === current?.id}
            onChangeStatus={(todo, value) => onChangeStatus(todo, value)}
          ></TodoItem>
        ))}
      </div>
    </>
  );
}

/**
 * Renders the header row for the TodoGrid component.
 * 
 * @returns The JSX elements representing the header row.
 */
function GridHeader() {
  // GridHeader is used in TodoGrid, this produces one row for TodoGrid
  return (
    <>
      <span>Done</span>
      <span>Task</span>
      <span className="hidden lg:flex">Description</span>
      <span className="hidden lg:flex">Assigned</span>
      <span className="hidden lg:flex">Deadline</span>
      <span className="text-right">Priority</span>
    </>
  );
}
