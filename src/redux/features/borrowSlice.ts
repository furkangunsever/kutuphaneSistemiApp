import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';

interface Borrow {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  bookImage?: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  remainingDays: number;
  status?: 'borrowed' | 'returned' | 'overdue';
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  notes?: string;
}

interface BorrowState {
  activeBorrows: Borrow[];
  overdueBorrows: Borrow[];
  userBorrows: Borrow[];
  bookBorrows: Borrow[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BorrowState = {
  activeBorrows: [],
  overdueBorrows: [],
  userBorrows: [],
  bookBorrows: [],
  isLoading: false,
  error: null,
};

// Aktif ödünç kayıtlarını getir
export const fetchActiveBorrows = createAsyncThunk(
  'borrows/fetchActive',
  async (_, {getState, rejectWithValue}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(`${BASE_URL}/borrows/active`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('Active Borrows Response:', response.data);
      return response.data.borrows || response.data;
    } catch (error: any) {
      console.error('Active Borrows Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Bir hata oluştu',
      );
    }
  },
);

// Gecikmiş kitapları getir
export const fetchOverdueBorrows = createAsyncThunk(
  'borrows/fetchOverdue',
  async (_, {getState, rejectWithValue}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(`${BASE_URL}/borrows/overdue`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('Overdue Borrows Response:', response.data);
      return response.data.borrows || response.data;
    } catch (error: any) {
      console.error('Overdue Borrows Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Bir hata oluştu',
      );
    }
  },
);

// Kitap iade et
export const returnBook = createAsyncThunk(
  'borrows/return',
  async (
    {
      borrowId,
      condition,
      notes,
    }: {
      borrowId: string;
      condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
      notes?: string;
    },
    {getState, rejectWithValue},
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.put(
        `${BASE_URL}/borrows/return/${borrowId}`,
        {condition, notes},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Bir hata oluştu',
      );
    }
  },
);

const borrowSlice = createSlice({
  name: 'borrows',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchActiveBorrows.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchActiveBorrows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBorrows = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveBorrows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOverdueBorrows.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchOverdueBorrows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overdueBorrows = action.payload;
        state.error = null;
      })
      .addCase(fetchOverdueBorrows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(returnBook.pending, state => {
        state.isLoading = true;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.isLoading = false;
        // Başarılı iade işleminden sonra aktif ödünç listesini güncelle
        state.activeBorrows = state.activeBorrows.filter(
          borrow => borrow.id !== action.payload.id,
        );
        state.error = null;
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default borrowSlice.reducer;
