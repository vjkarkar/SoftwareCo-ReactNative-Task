import { createSlice } from '@reduxjs/toolkit';
import { setAuthToken, clearAuthToken } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@softwareco_token';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        setAuthToken(action.payload);
      }
    },
    logout: state => {
      state.token = null;
      state.isAuthenticated = false;
      clearAuthToken();
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export const persistToken = (token: string) => async (dispatch: any) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  dispatch(setToken(token));
};

export const loadStoredToken = () => async (dispatch: any) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    setAuthToken(token);
    dispatch(setToken(token));
  }
};

export const clearStoredToken = () => async (dispatch: any) => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  dispatch(logout());
};

export default authSlice.reducer;
