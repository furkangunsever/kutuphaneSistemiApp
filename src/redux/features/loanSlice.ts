import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';

interface LoanState {
  isLoading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  isLoading: false,
  error: null,
};

export const borrowBook = createAsyncThunk(
  'loan/borrowBook',
  async (bookId: string, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.post(
        `${BASE_URL}/books/${bookId}/borrow`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ödünç alma işlemi başarısız oldu',
      );
    }
  },
);

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(borrowBook.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default loanSlice.reducer; 