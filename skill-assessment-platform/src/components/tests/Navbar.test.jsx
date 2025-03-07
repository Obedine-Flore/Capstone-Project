import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../layout/Navbar';

describe('Navbar Component', () => {
  const setIsSidebarOpen = vi.fn();
  const isSidebarOpen = false;

  test('renders the SkillsAssess logo', () => {
    render(
      <MemoryRouter>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </MemoryRouter>
    );
    const logoText = screen.getByText(/SkillsAssess/i);
    expect(logoText).toBeInTheDocument();
  });

  test('renders the menu button', () => {
    render(
      <MemoryRouter>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </MemoryRouter>
    );
    const menuButton = screen.getByTestId('menu-button');
    expect(menuButton).toBeInTheDocument();
  });

  test('renders the bell notification button', () => {
    render(
      <MemoryRouter>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </MemoryRouter>
    );
    const bellButton = screen.getByTestId('bell-button');
    expect(bellButton).toBeInTheDocument();
  });

  test('renders the profile link', () => {
    render(
      <MemoryRouter>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </MemoryRouter>
    );
    const profileLink = screen.getByRole('link', { href: '/profile' });
    expect(profileLink).toBeInTheDocument();
  });
});