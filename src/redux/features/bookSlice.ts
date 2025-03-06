import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {Book} from '../../types/book';

interface BookState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  isLoading: false,
  error: null,
};

const BASE_URL = 'http://192.168.119.219:5000/api';

// Kitapları getir
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue("Yetkilendirme token'ı bulunamadı");
      }

      const response = await axios.get(`${BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Kitaplar getirilirken bir hata oluştu',
      );
    }
  },
);

// Kitap ekle
export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData: Omit<Book, '_id'>, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue("Yetkilendirme token'ı bulunamadı");
      }

      const response = await axios.post(`${BASE_URL}/books`, bookData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue(
          'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
        );
      }

      if (error.response?.data?.message?.includes('E11000')) {
        return rejectWithValue('Bu ISBN numarası ile daha önce kitap eklenmiş');
      }

      return rejectWithValue(
        error.response?.data?.message || 'Kitap eklenirken bir hata oluştu',
      );
    }
  },
);

// Kitap güncelle
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async (
    {id, bookData}: {id: string; bookData: Partial<Book>},
    {rejectWithValue, getState},
  ) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue("Yetkilendirme token'ı bulunamadı");
      }

      const response = await axios.put(`${BASE_URL}/books/${id}`, bookData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Kitap güncellenirken bir hata oluştu',
      );
    }
  },
);

// Kitap sil
export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue("Yetkilendirme token'ı bulunamadı");
      }

      await axios.delete(`${BASE_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Kitap silinirken bir hata oluştu',
      );
    }
  },
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch Books
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
      })
      // Add Book
      .addCase(addBook.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Book
      .addCase(updateBook.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.books.findIndex(
          book => book._id === action.payload._id,
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Book
      .addCase(deleteBook.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(book => book._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookSlice.reducer;
