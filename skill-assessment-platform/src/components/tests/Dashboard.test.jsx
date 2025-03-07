import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Link } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock Link from react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Link: vi.fn(({ children, to }) => <a href={to}>{children}</a>),
}));

describe('Dashboard UI Component', () => {
  const mockUserData = {
    name: 'Test User',
    profile_picture: 'http://example.com/profile.jpg',
  };

  const mockAssessmentHistory = [
    { id: 1, skillId: 1, score: 80 },
    { id: 2, skillId: 2, score: 60 },
  ];

  const mockSkills = [
    {
      id: 1,
      name: 'Communication',
      category: 'Soft Skills',
      description: 'Effective communication skills.',
      assessmentCount: 5,
      difficulty: 'Beginner',
    },
    {
      id: 2,
      name: 'JavaScript',
      category: 'Technical',
      description: 'JavaScript programming skills.',
      assessmentCount: 3,
      difficulty: 'Intermediate',
    },
  ];

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test User' });
        }
        if (key === 'token') {
          return 'test_token';
        }
        return null;
      }),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;

    // Mock API responses
    const mockResolvedValue = (data) => Promise.resolve({ data });
    const localStorage = {};

    axios.get = vi.fn().mockImplementation((url) => {
      if (url === 'http://3.82.241.188/api/profile') {
        return mockResolvedValue(mockUserData);
      } else if (
        url.startsWith('http://3.82.241.188/api/user-assessments/history')
      ) {
        return mockResolvedValue(mockAssessmentHistory);
      } else if (url === 'http://3.82.241.188/api/all-skills') {
        return mockResolvedValue({ skills: mockSkills, hasMore: false });
      } else if (url === 'http://3.82.241.188/api/recommended-skills') {
        return mockResolvedValue({ skills: mockSkills, hasMore: false });
      }
      return Promise.reject(new Error('URL not mocked'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the component without crashing', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/SkillsAssess/i)).toBeInTheDocument();
    });
  });

  test('renders the welcome message with user name', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello Test User/i)).toBeInTheDocument();
    });
  });

  test('renders the navigation links', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Assessments/i)).toBeInTheDocument();
      expect(screen.getByText(/Blog/i)).toBeInTheDocument();
    });
  });

  test('renders the search input and category filter', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search skills.../i)
      ).toBeInTheDocument();
      expect(screen.getByText(/All Categories/i)).toBeInTheDocument();
    });
  });

  test('renders the all skills section', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/All Skills/i)).toBeInTheDocument();
    });
  });

  test('renders the recommended skills section', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Recommended Skills/i)).toBeInTheDocument();
    });
  });

  test('filters all skills section correctly', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/All Skills/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Technical' },
    });

    await waitFor(() => {
      expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
      const communicationSkill = screen.queryByText(/Communication/i);
      expect(communicationSkill).toBeNull();
    });
  });
});