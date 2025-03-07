import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Link } from 'react-router-dom';
import axios from 'axios';
import BlogLandingPage from './BlogLandingPage'; // Corrected path

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual implementations for other exports
  Link: jest
    .fn()
    .mockImplementation(({ children, to }) => <a href={to}>{children}</a>),
}));

describe('BlogLandingPage Component', () => {
  const mockBlogPosts = [
    {
      id: 1,
      title: 'Test Blog Post 1',
      excerpt: 'This is a test excerpt.',
      author: 'Test Author',
      category: 'Technology',
      date: '2024-01-01T00:00:00.000Z',
      image_path: 'http://example.com/image1.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'Test Blog Post 2',
      excerpt: 'This is another test excerpt.',
      author: 'Test Author',
      category: 'Design',
      date: '2024-01-02T00:00:00.000Z',
      image_path: 'http://example.com/image2.jpg',
      featured: false,
    },
  ];

  const mockUserData = {
    profile_picture: 'http://example.com/profile.jpg',
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUserData });
    axios.post.mockResolvedValue({ data: {} });
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockBlogPosts)),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with loading state', () => {
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify([])),
    });
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );
    const loadingElements = screen.getAllByRole('article');
    expect(loadingElements.length).toBeGreaterThan(0); // adjust based on your loading indicators
  });

  test('renders blog posts after loading', async () => {
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Blog Post 2/i)).toBeInTheDocument();
    });
  });

  test('filters blog posts by category', async () => {
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Blog Post 2/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Design/i));

    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 2/i)).toBeInTheDocument();
      const post1 = screen.queryByText(/Test Blog Post 1/i);
      expect(post1).toBeNull();
    });
  });

  test('filters blog posts by search query', async () => {
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Blog Post 2/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search articles, skills, authors.../i
    );
    fireEvent.change(searchInput, { target: { value: 'Post 1' } });

    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 1/i)).toBeInTheDocument();
      const post2 = screen.queryByText(/Test Blog Post 2/i);
      expect(post2).toBeNull();
    });
  });

  test('displays a message when no blog posts match the criteria', async () => {
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify([])),
    });
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText(/Insights from our team/i)).toBeInTheDocument();
    });
  });

  test('navigates to blog post on link click', async () => {
    render(
      <MemoryRouter>
        <BlogLandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Blog Post 1/i)).toBeInTheDocument();
    });
    expect(Link).toHaveBeenCalledTimes(2);
  });
});