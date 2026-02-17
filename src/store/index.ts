import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadStoredToken } from './authSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export { loadStoredToken };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
