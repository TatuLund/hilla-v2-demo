import type Todo from 'Frontend/generated/com/example/application/data/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onChangeStatus: (todo: Todo, value: boolean | undefined) => void;
  onClick: (todo: Todo) => void;
};

// Display list of todos in CSS Grid
export function TodoGrid({ todos, onChangeStatus, onClick }: Props): JSX.Element {
  return (
    <>
      <div style={{height : "300px"}} className="p-m grid grid-cols-3 lg:grid-cols-6 gap-s overflow-auto flex-grow">
        <GridHeader />
        {todos.map((todo) => (
          <TodoItem
            onClick={(todo) => onClick(todo)}
            key={todo.id}
            todo={todo}
            onChangeStatus={(todo, value) => onChangeStatus(todo, value)}
          ></TodoItem>
        ))}
      </div>
    </>
  );
}

function GridHeader() {
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
