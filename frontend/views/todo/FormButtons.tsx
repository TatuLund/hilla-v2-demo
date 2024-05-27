import { Button } from '@vaadin/react-components/Button.js';
import { useAuth } from 'Frontend/auth';
import Contact from 'Frontend/generated/com/example/application/data/Contact';

type Props = {
  onAssign: () => void;
  onSave: () => void;
  disabled: boolean;
  invalid: boolean;
  assigned: Contact | undefined;
  adding: boolean;
};

/**
 * Renders the form buttons component.
 * @returns The rendered form buttons component.
 */
export default function FormButtons({ onAssign, onSave, invalid, assigned, adding, disabled }: Props): JSX.Element {
  const { hasAccess } = useAuth();

  return (
    <>
      <div className="flex">
        <Button disabled={!hasAccess({ rolesAllowed: ['ROLE_ADMIN'] }) || disabled} onClick={onAssign}>
          {assigned ? assigned.firstName + ' ' + assigned.lastName : 'Assign'}
        </Button>
        <Button tabIndex={1} id="add" className="ml-auto" theme="primary" disabled={invalid || disabled} onClick={onSave}>
          {adding ? 'Add' : 'Update'}
        </Button>
      </div>
    </>
  );
}
