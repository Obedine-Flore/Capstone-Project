import React from 'react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SignUp from '../../components/landing/SignUp';

vi.mock('axios');

describe('SignUp Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the sign up form', () => {
    render(<SignUp />);
    const signUpForm = screen.getByText(/Create an Account/i);
    expect(signUpForm).toBeInTheDocument();
  });

  test('renders input fields for name, email, and password', () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders terms and conditions checkbox', () => {
    render(<SignUp />);
    const termsCheckbox = screen.getByLabelText(
      /I agree with the terms and conditions/i
    );
    expect(termsCheckbox).toBeInTheDocument();
  });

  test('displays error message if terms are not agreed', () => {
    render(<SignUp />);
    const submitButton = screen.getByText(/Sign Up/i);
    fireEvent.click(submitButton);
    const errorMessage = screen.getByText(
      /Please agree to the terms and conditions/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('disables submit button when loading', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const termsCheckbox = screen.getByLabelText(
      /I agree with the terms and conditions/i
    );
    const submitButton = screen.getByText(/Sign Up/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    axios.post = vi.fn().mockImplementation(() => Promise.resolve({ data: {} }));

    fireEvent.click(submitButton);
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  test('calls API with user data on submit', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const termsCheckbox = screen.getByLabelText(
      /I agree with the terms and conditions/i
    );
    const submitButton = screen.getByText(/Sign Up/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    axios.post = vi.fn().mockImplementation(() => Promise.resolve({ data: {} }));

    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/auth/register',
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }
    );
  });

  test('displays error message on API failure', async () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const termsCheckbox = screen.getByLabelText(
      /I agree with the terms and conditions/i
    );
    const submitButton = screen.getByText(/Sign Up/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    axios.post = vi.fn().mockImplementation(() => Promise.reject(new Error('API Error')));

    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Registration failed. Please try again./i)
      ).toBeInTheDocument()
    );
  });
});