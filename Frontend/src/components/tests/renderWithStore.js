import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export const queryClient = new QueryClient();

export function renderWithStore(ui, { isLoggedIn = true, preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isLoggedIn,
        username: isLoggedIn ? 'TestUser' : null,
        ...preloadedState.auth,
      },
      ...preloadedState,
    },
  });

  return {
    store,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    ),
  };
}
