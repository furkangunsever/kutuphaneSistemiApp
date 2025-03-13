import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';

interface Borrow {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string | null;
  isbn: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'active' | 'returned' | 'overdue';
  notes: string | null;
}

interface UserBooksState {
  borrows: Borrow[];
  count: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserBooksState = {
  borrows: [],
  count: 0,
  isLoading: false,
  error: null,
};

export const fetchUserBorrows = createAsyncThunk(
  'userBooks/fetchBorrows',
  async (_, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(`${BASE_URL}/borrows/my-borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ödünç bilgileri alınamadı',
      );
    }
  },
);

const userBookSlice = createSlice({
  name: 'userBooks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserBorrows.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBorrows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.borrows = action.payload.borrows;
        state.count = action.payload.count;
      })
      .addCase(fetchUserBorrows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userBookSlice.reducer;
