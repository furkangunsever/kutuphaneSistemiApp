import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import bookReducer from './features/bookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
