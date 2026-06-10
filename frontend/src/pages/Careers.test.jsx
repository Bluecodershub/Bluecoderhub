import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Careers from '../pages/Careers';
import { api } from '../utils/api';

vi.mock('../utils/api');

describe('Careers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays static job openings in selection dropdown', async () => {
    render(
      <BrowserRouter>
        <Careers />
      </BrowserRouter>
    );
    
    // Careers component populates the position dropdown from local jobs.json
    expect(screen.getByText('Senior Full Stack Developer')).toBeInTheDocument();
  });

  it('shows application form', async () => {
    render(
      <BrowserRouter>
        <Careers />
      </BrowserRouter>
    );
    
    const form = await screen.findByRole('form', { name: /job application form/i });
    expect(form).toBeInTheDocument();
  });

  it('validates form submission', async () => {
    api.createApplication.mockRejectedValue(new Error('Required'));
    
    render(
      <BrowserRouter>
        <Careers />
      </BrowserRouter>
    );
    
    const user = userEvent.setup();
    const submitButton = await screen.findByRole('button', { name: /submit|apply/i });
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});