import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import bookReducer from './features/bookSlice';
import loanReducer from './features/loanSlice';
import userBookReducer from './features/userBookSlice';
import dashboardReducer from './features/dashboardSlice';
import loanManagementReducer from './features/loanManagementSlice';
import borrowReducer from './features/borrowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    loan: loanReducer,
    userBooks: userBookReducer,
    dashboard: dashboardReducer,
    loanManagement: loanManagementReducer,
    borrows: borrowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
