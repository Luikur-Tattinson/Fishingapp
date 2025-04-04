jest.mock('../../utils/axiosInstance');

import axiosInstance from '../../utils/axiosInstance';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithStore, queryClient } from './renderWithStore';
import Searchbar from '../Database/Searchbar';
import { within } from '@testing-library/react';

afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

describe('Search bar functionality', () => {
    beforeEach(() => {
      axiosInstance.get.mockClear();
      axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: 1,
            species: 'Pike',
            weight: 4.0,
            length: 85,
            date_caught: '2025-04-01',
            area: 'Lakeville',
            body_of_water: 'River A',
            user: 'Tester',
          },
        ],
      });
    });

    test('searches across all fields when no field is selected', async () => {
        const setCatches = jest.fn();
        const setCurrentPage = jest.fn();

        renderWithStore(<Searchbar setCatches={setCatches} setCurrentPage={setCurrentPage} />, { isLoggedIn: true });
      
        const input = screen.getByTestId('search-input');
        fireEvent.change(input, { target: { value: 'Lakeville' } });
      
        expect(input.value).toBe('Lakeville');
      
        await waitFor(() => {
          expect(axiosInstance.get).toHaveBeenCalledWith(
            'http://localhost:8000/api/catches/search/',
            expect.objectContaining({
              params: {
                search: 'Lakeville',
              },
            })
          );
        });
      });
    
    test('caches search results for repeated queries', async () => {
        const setCatches = jest.fn();
        const setCurrentPage = jest.fn();

        const { container } = renderWithStore(
          <Searchbar setCatches={setCatches} setCurrentPage={setCurrentPage} />,
          { isLoggedIn: true }
        );
      
        const utils = within(container);
        const input = utils.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'Pike' } });
      
        const select = utils.getByRole('combobox');
        userEvent.selectOptions(select, 'species');
      
        await waitFor(() => {
          expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        });
      
        const rerendered = renderWithStore(
          <Searchbar setCatches={setCatches} setCurrentPage={setCurrentPage} />,
          { isLoggedIn: true }
        );
      
        const rerenderUtils = within(rerendered.container);
        const inputAgain = rerenderUtils.getByPlaceholderText(/search/i);
        fireEvent.change(inputAgain, { target: { value: 'Pike' } });
      
        userEvent.selectOptions(rerenderUtils.getByRole('combobox'), 'species');
      
        await waitFor(() => {
          
          expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        });
      });
      
      test('performs a keyword and category search', async () => {
        const setCatches = jest.fn();
        const setCurrentPage = jest.fn();

        renderWithStore(<Searchbar setCatches={setCatches} setCurrentPage={setCurrentPage} />, { isLoggedIn: true });
    
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'Pike' } });
    
        expect(input.value).toBe('Pike');
    
        const select = screen.getByRole('combobox');
        userEvent.selectOptions(select, 'species');
    
        await waitFor(() => {
          expect(axiosInstance.get).toHaveBeenCalledWith(
            'http://localhost:8000/api/catches/search/',
            expect.objectContaining({
              params: {
                field: 'species',
                search: 'Pike',
              },
            })
          );
        });
      });

});