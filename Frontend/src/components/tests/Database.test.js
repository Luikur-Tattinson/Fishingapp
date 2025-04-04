jest.mock('../../utils/axiosInstance');

import { screen } from '@testing-library/react';
import Database from '../Database/Database';
import { renderWithStore, queryClient } from './renderWithStore';

afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

describe('Database page login visibility', () => {
  test('shows button when logged in', () => {
    renderWithStore(<Database />, { isLoggedIn: true });
    expect(screen.getByText(/add a new entry/i)).toBeInTheDocument();
  });

  test('hides button when not logged in', () => {
    renderWithStore(<Database />, { isLoggedIn: false });
    expect(screen.queryByText(/add a new entry/i)).not.toBeInTheDocument();
  });
});

