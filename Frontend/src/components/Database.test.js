jest.mock('../utils/axiosInstance');

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Database from '../components/Database';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div></div>,
  Marker: () => <div></div>,
  useMapEvents: () => {},
  useMap: () => ({
    setView: jest.fn(), // Mock the setView method
  }),
}));


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

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Database />
        </BrowserRouter>
      </Provider>
    ),
  };
}

describe('Database page login visibility', () => {
  test('shows button when logged in', () => {
    renderWithStore(true);
    expect(screen.getByText(/add a new entry/i)).toBeInTheDocument();
  });

  test('hides button when not logged in', () => {
    renderWithStore(false);
    expect(screen.queryByText(/add a new entry/i)).not.toBeInTheDocument();
  });
});

describe('Geolocation feature', () => {
  beforeEach(() => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: { latitude: 62.12345, longitude: 25.12345 },
        })
      ),
    };
  });

  test('uses geolocation and updates coords on button click', async () => {
    renderWithStore(true);
    userEvent.click(screen.getByText(/add a new entry/i));
    userEvent.click(await screen.findByText(/use my location/i));
    await waitFor(() => {
      const latLngText = screen.getByText(/selected: 62.12345, 25.12345/i);
      expect(latLngText).toBeInTheDocument();
    });
  });
});

describe('Pagination on Database page', () => {
  beforeEach(() => {
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
    renderWithStore(true);
  
    await waitFor(() => {
      expect(screen.getByText('Fish 1')).toBeInTheDocument();
    });
  
    expect(screen.getAllByRole('row')).toHaveLength(11);
  
    userEvent.selectOptions(screen.getByRole('combobox'), '20');
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(21);
    });
  
    userEvent.selectOptions(screen.getByRole('combobox'), '30');
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(26);
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
    renderWithStore(true);
    await waitFor(() => screen.getByText('Pike'));
    const header = screen.getByText(/weight/i);
    userEvent.click(header);
    await waitFor(() => expect(screen.getAllByRole('row')[1].textContent).toMatch(/Bass/));
    userEvent.click(header);
    await waitFor(() => expect(screen.getAllByRole('row')[1].textContent).toMatch(/Pike/));
  });
});

describe('Catch entry submission', () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: [] });
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
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: { latitude: 62.12345, longitude: 25.12345 },
        })
      ),
    };

    localStorage.setItem('accessToken', 'mock-token');
  });

  test('fills and submits the catch form', async () => {
    renderWithStore(true);
  
    userEvent.click(screen.getByText(/add a new entry/i));
  
    const areaInput = await screen.findByLabelText(/area/i);
    userEvent.type(areaInput, 'Lake Test');
    userEvent.type(screen.getByLabelText(/Body of water/i), 'River Test');
    userEvent.type(screen.getByLabelText(/Species/i), 'Salmon');
    userEvent.type(screen.getByLabelText(/Weight/i), '3.5');
    userEvent.type(screen.getByLabelText(/Length/i), '70');
    userEvent.type(screen.getByLabelText(/Catch date/i), '2025-04-02');
    userEvent.type(screen.getByLabelText(/Catch Time/i), '13:00');

    userEvent.click(screen.getByText(/add a new entry/i));
    await screen.findByText(/use my location/i);
    userEvent.click(screen.getByText(/use my location/i));



    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);
  
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/catches/add/',
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });
});

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
    renderWithStore(true);
    fireEvent.click(await screen.findByText(/pike/i));
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

