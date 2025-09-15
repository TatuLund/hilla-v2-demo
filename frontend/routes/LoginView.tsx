import { LoginI18n, LoginOverlay } from '@vaadin/react-components/LoginOverlay.js';
import { PasswordFieldElement } from '@vaadin/react-components/PasswordField.js';
import { Navigate } from 'react-router';
import { useAuth } from 'Frontend/auth.js';
import { useSignal } from '@vaadin/hilla-react-signals';

const loginI18nDefault: LoginI18n = {
  form: {
    title: 'Log in',
    username: 'Username',
    password: 'Password',
    submit: 'Log in',
    forgotPassword: 'Forgot password',
  },
  header: { title: 'My App', description: 'Login using user/user or admin/admin' },
  errorMessage: {
    title: 'Incorrect username or password',
    message: 'Check that you have entered the correct username and password and try again.',
    username: 'Username is required',
    password: 'Password is required',
  },
};

export default function LoginView() {
  // const { state, authenticate } = useContext(AuthContext);
  const { state, login } = useAuth();
  const hasError = useSignal<boolean>();
  const url = useSignal<string>();

  if (state.user && url.value) {
    const path = new URL(url.value, document.baseURI).pathname;
    return <Navigate to={path} replace />;
  }

  return (
    <LoginOverlay
      ref={(element) => {
        setTimeout(() => {
          addCapsLockWarning();
        }, 100);
      }}
      opened
      error={hasError.value}
      noForgotPassword
      i18n={loginI18nDefault}
      onLogin={async ({ detail: { username, password } }) => {
        const { defaultUrl, error, redirectUrl } = await login(username, password);
        if (error) {
          hasError.value = true;
        } else {
          localStorage.setItem('loggedIn', 'true');
          url.value = redirectUrl ?? defaultUrl ?? '/';
        }
      }}
    />
  );

  function setWarning(field: PasswordFieldElement, e: KeyboardEvent) {
    if (e.getModifierState('CapsLock')) {
      field.helperText = 'Warning: Caps on';
      field.style.setProperty('--vaadin-input-field-helper-color', 'var(--lumo-warning-text-color)');
    } else {
      field.helperText = '';
    }
  }

  function addCapsLockWarning() {
    const field = document.getElementsByTagName('vaadin-password-field')[0];
    field?.addEventListener('keydown', (e) => setWarning(field, e));
  }
}
