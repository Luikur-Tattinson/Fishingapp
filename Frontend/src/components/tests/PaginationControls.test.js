jest.mock('../../utils/axiosInstance');

import axiosInstance from '../../utils/axiosInstance';
import userEvent from '@testing-library/user-event';
import { screen, waitFor  } from '@testing-library/react';
import { renderWithStore, queryClient } from './renderWithStore';
import Database from '../Database/Database';

afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

describe('Pagination on Database page', () => {
    beforeEach(() => {
      axiosInstance.get.mockClear();
      axiosInstance.get.mockResolvedValue({
        data: Array.from({ length: 25 }, (_, i) => ({
          id: i,
          species: `Fish ${i + 1}`,
          weight: 1.2,
          length: 50,
          date_caught: '2025-04-01',
          area: 'Lakeshire',
          body_of_water: 'River X',
          user: 'UserX',
        })),
      });
    });
  
    test('changes number of displayed rows when selecting 10, 20, 30', async () => {

      renderWithStore(<Database />, { isLoggedIn: true });
    
      await waitFor(() => {
        expect(screen.getByText('Fish 1')).toBeInTheDocument();
      });
    
      expect(screen.getAllByRole('row')).toHaveLength(11); // 10 + header
    
      const paginationSelect = screen.getByTestId('entries-per-page');
    
      userEvent.selectOptions(paginationSelect, '20');
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(21);
      });
    
      userEvent.selectOptions(paginationSelect, '30');
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(26); // 25 + header
      });
    });
  });

  describe('Column sorting on Database page', () => {
    beforeEach(() => {
      axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: 1,
            species: 'Pike',
            weight: 5.0,
            length: 90,
            date_caught: '2025-04-01',
            area: 'Test Area',
            body_of_water: 'Test River',
            user: 'Tester',
          },
          {
            id: 2,
            species: 'Bass',
            weight: 2.0,
            length: 60,
            date_caught: '2025-04-02',
            area: 'Test Area',
            body_of_water: 'Test River',
            user: 'Tester',
          },
        ],
      });
    });
  
    test('sorts the weight column ascending and descending', async () => {
      renderWithStore(<Database />, { isLoggedIn: true });
      await waitFor(() => screen.getByText('Pike'));
      const header = screen.getByText(/weight/i);
      userEvent.click(header);
      await waitFor(() => expect(screen.getAllByRole('row')[1].textContent).toMatch(/Bass/));
      userEvent.click(header);
      await waitFor(() => expect(screen.getAllByRole('row')[1].textContent).toMatch(/Pike/));
    });
  });