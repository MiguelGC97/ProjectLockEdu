// login form tests by: sarah

import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import LoginForm from './LoginForm';

// test credentials
const usernameTest = import.meta.env.VITE_USERNAME_FOR_TEST;
const passwordTest = import.meta.env.VITE_PASSWORD_FOR_TEST;
const tokenTest = import.meta.env.VITE_TOKEN_FOR_TEST;

// mock the login service and useAuth hook
vi.mock('../../services/authService', () => ({
  login: vi.fn(() => ({
    username: usernameTest,
    password: passwordTest,
  })),
}));

vi.mock('../../hooks/AuthProvider', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('renders correctly', () => {
    render(
      <MantineProvider theme={theme}>
        <Router>
          <LoginForm />
        </Router>
      </MantineProvider>
    );

    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <MantineProvider theme={theme}>
        <Router>
          <LoginForm />
        </Router>
      </MantineProvider>
    );

    // simulate typing in the inputs
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: usernameTest },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: passwordTest },
    });

    // simulate form submission (clicking the submit button)
    fireEvent.click(screen.getByTestId('submit-button'));

    // make sure that inputs have the expected values
    expect(screen.getByTestId('username-input')).toHaveValue(usernameTest);
    expect(screen.getByTestId('password-input')).toHaveValue(passwordTest);
  });

  it('shows error message on login failure', async () => {
    // mock the login failure case
    vi.mock('../../services/authService', () => ({
      login: vi.fn(() => {
        return Promise.reject(new Error('Login failed'));
      }),
    }));

    render(
      <MantineProvider theme={theme}>
        <Router>
          <LoginForm />
        </Router>
      </MantineProvider>
    );

    // fill in the form with incorrect credentials
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'error@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpassword' },
    });

    // simulate form submission (clicking the submit button)
    fireEvent.click(screen.getByTestId('submit-button'));

    // wait for the error message to appear in the document
    const errorMessage = await screen.findByTestId('login-error');

    // make sure that the error message is visible and has the correct content
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Login failed');
  });
});
