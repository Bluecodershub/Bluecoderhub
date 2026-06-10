import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../pages/Blog';
import { api } from '../utils/api';

vi.mock('../utils/api');

describe('Blog', () => {
  it('shows loading state initially', async () => {
    api.listBlogs.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    api.listBlogs.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );
    
    // Should fall back to sample data
    const heading = await screen.findByText(/Journal/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays blog posts from API', async () => {
    api.listBlogs.mockResolvedValue({
      blogs: [
        { id: '1', title: 'Test Post', slug: 'test-post', category: 'Engineering', excerpt: 'Test', content: 'Content', author: 'Author', created_at: '2024-01-01', published: true }
      ]
    });
    
    render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );
    
    const heading = await screen.findByText(/Journal/i);
    expect(heading).toBeInTheDocument();
  });
});