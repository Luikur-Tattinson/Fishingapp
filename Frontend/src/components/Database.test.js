import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Database from '../components/Database';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function renderWithStore(isLoggedIn) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isLoggedIn,
        username: isLoggedIn ? 'TestUser' : null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <Database />
    </Provider>
  );
}

describe('Database page login visibility', () => {
  test('shows button when logged in', () => {
    renderWithStore(true);

    const button = screen.getByText(/add a new entry/i);
    expect(button).toBeInTheDocument();
  });

  test('hides button when not logged in', () => {
    renderWithStore(false);

    const button = screen.queryByText(/add a new entry/i);
    expect(button).not.toBeInTheDocument();
  });
});

describe('Geolocation feature', () => {
    beforeEach(() => {
      // Mock geolocation
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: {
              latitude: 62.12345,
              longitude: 25.12345,
            },
          })
        ),
      };
      global.navigator.geolocation = mockGeolocation;
    });
  
    test('uses geolocation and updates coords on button click', async () => {
      renderWithStore(true);  // user is logged in
  
      // Open the modal
      const openButton = screen.getByText(/add a new entry/i);
      userEvent.click(openButton);
  
      // Click "Use My Location" button
      const locationButton = await screen.findByText(/use my location/i);
      userEvent.click(locationButton);
  
      // Confirm that coordinates are displayed
      const coordsText = await screen.findByText(/selected: 62.12345, 25.12345/i);
      expect(coordsText).toBeInTheDocument();
    });
  });

  jest.mock('axios', () => ({
    get: jest.fn(() =>
      Promise.resolve({
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
      })
    ),
  }));
  
  describe('Pagination on Database page', () => {
    test('changes number of displayed rows when selecting 10, 20, 30', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Database />
          </BrowserRouter>
        </Provider>
      );
  
      // Wait for table to be populated
      await waitFor(() => {
        expect(screen.getByText('Fish 1')).toBeInTheDocument();
      });
  
      // Default to 10 rows?
      expect(screen.getAllByRole('row')).toHaveLength(11); // 10 rows + header
  
      // Click "20 per page" button
      const twentyBtn = screen.getByText('20');
      userEvent.click(twentyBtn);
  
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(21); // 20 rows + header
      });
  
      // Click "30 per page" button
      const thirtyBtn = screen.getByText('30');
      userEvent.click(thirtyBtn);
  
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(26); // Only 25 results in mock + header
      });
    });
  });

  jest.mock('axios', () => ({
    get: jest.fn(() =>
      Promise.resolve({
        data: [
          {
            id: 1,
            species: 'Pike',
            weight: 5.0,
            length: 90,
            date_caught: '2025-04-01',
            area: 'Huvilakatu',
            body_of_water: 'River A',
            user: 'Jutta',
          },
          {
            id: 2,
            species: 'Bass',
            weight: 2.0,
            length: 60,
            date_caught: '2025-04-02',
            area: 'Tapiola',
            body_of_water: 'River B',
            user: 'Kari',
          },
        ],
      })
    ),
  }));
  
  describe('Column sorting on Database page', () => {
    test('sorts the weight column ascending and descending', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Database />
          </BrowserRouter>
        </Provider>
      );
  
      // Wait for rows to show up
      await waitFor(() => {
        expect(screen.getByText('Pike')).toBeInTheDocument();
        expect(screen.getByText('Bass')).toBeInTheDocument();
      });
  
      // Click the Weight column to sort ascending
      const weightHeader = screen.getByText(/weight/i);
      userEvent.click(weightHeader);
  
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        const cells = rows[1].querySelectorAll('td');
        expect(cells[0].textContent).toBe('Bass'); // Lighter fish first
      });
  
      // Click again to sort descending
      userEvent.click(weightHeader);
  
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        const cells = rows[1].querySelectorAll('td');
        expect(cells[0].textContent).toBe('Pike'); // Heavier fish first
      });
    });
  });

  jest.mock('../axiosInstance');

describe('Catch entry submission', () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({
      data: [],
    });

    axiosInstance.post.mockResolvedValue({
      data: {
        id: 1,
        area: 'Lake Test',
        body_of_water: 'River Test',
        species: 'Salmon',
        weight: 3.5,
        length: 70,
        date_caught: '2025-04-02',
        time_caught: '13:00',
        latitude: 62.1234,
        longitude: 25.1234,
        user: 'Tester',
      },
    });

    localStorage.setItem('accessToken', 'mock-token'); // So form is visible
  });

  test('fills and submits the catch form', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Database />
        </BrowserRouter>
      </Provider>
    );

    // Click "Add a new entry" button
    const addButton = screen.getByText(/add a new entry/i);
    userEvent.click(addButton);

    // Fill out the form fields
    userEvent.type(screen.getByLabelText(/area/i), 'Lake Test');
    userEvent.type(screen.getByLabelText(/body of water/i), 'River Test');
    userEvent.type(screen.getByLabelText(/species/i), 'Salmon');
    userEvent.type(screen.getByLabelText(/weight/i), '3.5');
    userEvent.type(screen.getByLabelText(/length/i), '70');
    userEvent.type(screen.getByLabelText(/catch date/i), '2025-04-02');
    userEvent.type(screen.getByLabelText(/catch time/i), '13:00');

    // Trigger submit
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitBtn);

    // Assert axios.post was called with form data
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/catches/add/',
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });
});

jest.mock('../axiosInstance');

describe('Weather data in catch details modal', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'mock-token');

    axiosInstance.get.mockResolvedValue({
      data: [
        {
          id: 1,
          species: 'Pike',
          weight: 4.2,
          length: 85,
          date_caught: '2025-04-01',
          area: 'Test Area',
          body_of_water: 'Test River',
          user: 'Tester',
          latitude: 62.1,
          longitude: 25.3,
          temperature: 12.5,
          windspeed: 4.8,
          precipitation: 0.2,
          weather_code: 1,
        },
      ],
    });
  });

  test('displays weather data in modal', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Database />
        </BrowserRouter>
      </Provider>
    );

    // Wait for table to populate
    const catchRow = await screen.findByText(/pike/i);

    // Click on the row to open modal
    fireEvent.click(catchRow);

    // Wait for modal to appear and check weather fields
    await waitFor(() => {
      expect(screen.getByText(/temperature/i)).toBeInTheDocument();
      expect(screen.getByText(/12.5/i)).toBeInTheDocument();
      expect(screen.getByText(/windspeed/i)).toBeInTheDocument();
      expect(screen.getByText(/4.8/i)).toBeInTheDocument();
      expect(screen.getByText(/precipitation/i)).toBeInTheDocument();
      expect(screen.getByText(/0.2/i)).toBeInTheDocument();
    });
  });
});