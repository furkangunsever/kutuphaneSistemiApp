import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';
import {Book} from '../../types/book';

interface UserBookState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserBookState = {
  books: [],
  isLoading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'userBooks/fetchBooks',
  async (_, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(`${BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Kitaplar yüklenirken bir hata oluştu',
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
      .addCase(fetchBooks.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userBookSlice.reducer;
