import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  test('renders the landing page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const landingPageText = screen.getByText(/SkillsAssess/i); // Adjust text based on LandingPage content
    expect(landingPageText).toBeInTheDocument();
  });

  test('renders the SignIn route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const signInLink = screen.getByText(/Sign In/i); // Adjust text based on SignIn content
    expect(signInLink).toBeInTheDocument();
  });

  test('renders the Dashboard route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const dashboardLink = screen.getByText(/Dashboard/i); // Adjust text based on Dashboard content
    expect(dashboardLink).toBeInTheDocument();
  });
});