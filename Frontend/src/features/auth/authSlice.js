import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log('Login reducer triggered with:', action.payload);
            state.isLoggedIn = true;
            state.username = action.payload.username;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;