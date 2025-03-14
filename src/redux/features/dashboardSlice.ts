import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';

interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
}

interface Borrow {
  _id: string;
  book: Book;
  user: {
    _id: string;
    name: string;
  };
  borrowDate: string;
  dueDate: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

interface DashboardState {
  statistics: {
    totalBooks: number;
    borrowedBooks: number;
    dueBooks: number;
  };
  recentBorrows: Borrow[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  statistics: {
    totalBooks: 0,
    borrowedBooks: 0,
    dueBooks: 0,
  },
  recentBorrows: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue("Yetkilendirme token'ı bulunamadı");
      }

      // Kitap istatistiklerini al
      const booksResponse = await axios.get<Book[]>(`${BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Son ödünç işlemlerini al
      const borrowsResponse = await axios.get<{borrows: Borrow[]}>(
        `${BASE_URL}/librarian/borrows`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // İstatistikleri hesapla
      const books = booksResponse.data || [];
      const borrows = borrowsResponse.data?.borrows || [];

      const statistics = {
        totalBooks: books.length,
        borrowedBooks: books.filter((book: Book) => book.status === 'borrowed')
          .length,
        dueBooks: borrows.filter(
          (borrow: Borrow) =>
            borrow.status === 'borrowed' &&
            new Date(borrow.dueDate) < new Date(),
        ).length,
      };

      // Son 5 ödünç işlemini al ve null kontrolü yap
      const validBorrows = borrows
        .filter((borrow): borrow is Borrow =>
          Boolean(borrow && borrow.book && borrow.user && borrow.borrowDate),
        )
        .sort(
          (a, b) =>
            new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime(),
        )
        .slice(0, 5);

      return {
        statistics,
        recentBorrows: validBorrows,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Veriler alınırken bir hata oluştu',
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload.statistics;
        state.recentBorrows = action.payload.recentBorrows;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
