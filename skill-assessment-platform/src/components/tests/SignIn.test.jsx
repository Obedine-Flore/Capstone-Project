import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import SignIn from '../landing/SignIn';
import { describe, test, expect, vi, afterEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('SignIn Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the sign in form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const signInForm = screen.getByRole('heading', { name: /Sign In/i });
    expect(signInForm).toBeInTheDocument();
  });

  test('renders input fields for email and password', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders remember me checkbox', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const rememberMeCheckbox = screen.getByLabelText(/Remember Me/i);
    expect(rememberMeCheckbox).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    axios.post.mockImplementation(() => Promise.reject(new Error('API Error')));

    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.getByText(/API Error/i)
      ).toBeInTheDocument()
    );
  });

  test('calls API with user credentials on submit', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    axios.post.mockImplementation(() =>
      Promise.resolve({ data: { user: {}, token: 'token' } })
    );

    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('disables submit button when loading', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    axios.post.mockImplementation(() =>
      Promise.resolve({ data: { user: {}, token: 'token' } })
    );

    fireEvent.click(submitButton);
    await waitFor(() => expect(submitButton).toBeDisabled());
  });
});