import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BASE_URL} from '../../config/base_url';

interface LoanManagementState {
  selectedUser: {
    _id: string;
    name: string;
  } | null;
  selectedBook: {
    _id: string;
    title: string;
    author: string;
  } | null;
  borrows: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    book: {
      _id: string;
      title: string;
      author: string;
    };
    borrowDate: string;
    dueDate: string;
    status: 'borrowed' | 'returned' | 'overdue';
    condition?: string;
    notes?: string;
  }>;
  isLoading: boolean;
  error: string | null;
  findingUser: boolean;
  findUserError: string | null;
}

const initialState: LoanManagementState = {
  selectedUser: null,
  selectedBook: null,
  borrows: [],
  isLoading: false,
  error: null,
  findingUser: false,
  findUserError: null,
};

export const lendBook = createAsyncThunk(
  'loanManagement/lendBook',
  async (
    {
      userId,
      bookId,
      dueDate,
    }: {userId: string; bookId: string; dueDate: string},
    {rejectWithValue, getState},
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.post(
        `${BASE_URL}/librarian/lend`,
        {
          userId,
          bookId,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ödünç verme işlemi başarısız oldu',
      );
    }
  },
);

export const receiveBook = createAsyncThunk(
  'loanManagement/receiveBook',
  async (
    {
      borrowId,
      condition,
      notes,
    }: {borrowId: string; condition: string; notes: string},
    {rejectWithValue, getState},
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.put(
        `${BASE_URL}/librarian/receive/${borrowId}`,
        {
          condition,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'İade işlemi başarısız oldu',
      );
    }
  },
);

export const extendLoan = createAsyncThunk(
  'loanManagement/extendLoan',
  async (
    {borrowId, newDueDate}: {borrowId: string; newDueDate: string},
    {rejectWithValue, getState},
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.put(
        `${BASE_URL}/librarian/extend/${borrowId}`,
        {
          newDueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Süre uzatma işlemi başarısız oldu',
      );
    }
  },
);

export const fetchBorrows = createAsyncThunk(
  'loanManagement/fetchBorrows',
  async (_, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(`${BASE_URL}/librarian/borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ödünç işlemleri yüklenemedi',
      );
    }
  },
);

export const findUserByEmail = createAsyncThunk(
  'loanManagement/findUserByEmail',
  async (email: string, {rejectWithValue, getState}) => {
    try {
      const token = (getState() as RootState).auth.token;
      
      if (!token) {
        throw new Error('Yetkilendirme token\'ı bulunamadı');
      }

      const response = await axios.get(`${BASE_URL}/librarian/users/find`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // { _id, name, email } döner
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcı bulunamadı',
      );
    }
  },
);

const loanManagementSlice = createSlice({
  name: 'loanManagement',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (
        action.payload &&
        (action.payload._id || action.payload.email) &&
        action.payload.name
      ) {
        state.selectedUser = {
          _id: action.payload._id || action.payload.email,
          name: action.payload.name,
        };
        state.error = null;
      } else {
        state.error = 'Geçersiz kullanıcı verisi';
      }
    },
    setSelectedBook: (state, action) => {
      console.log('setSelectedBook payload:', action.payload); // Debug için
      if (
        action.payload &&
        (action.payload._id || action.payload.id) &&
        action.payload.title
      ) {
        state.selectedBook = {
          _id: action.payload._id || action.payload.id,
          title: action.payload.title,
          author: action.payload.author || 'Yazar bilgisi yok',
        };
        state.error = null;
      } else {
        state.error = 'Geçersiz kitap verisi';
        console.log('Geçersiz kitap verisi:', action.payload); // Debug için
      }
    },
    clearSelection: state => {
      state.selectedUser = null;
      state.selectedBook = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(lendBook.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(lendBook.fulfilled, state => {
        state.isLoading = false;
        state.selectedUser = null;
        state.selectedBook = null;
      })
      .addCase(lendBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBorrows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.borrows = action.payload;
      })
      .addCase(findUserByEmail.pending, state => {
        state.findingUser = true;
        state.findUserError = null;
      })
      .addCase(findUserByEmail.fulfilled, state => {
        state.findingUser = false;
      })
      .addCase(findUserByEmail.rejected, (state, action) => {
        state.findingUser = false;
        state.findUserError = action.payload as string;
      });
  },
});

export const {setSelectedUser, setSelectedBook, clearSelection} =
  loanManagementSlice.actions;
export default loanManagementSlice.reducer;
