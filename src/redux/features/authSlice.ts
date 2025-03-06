import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../config/base_url';

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  userRole: 'librarian' | 'user' | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  userRole: null,
};


export const login = createAsyncThunk(
  'auth/login',
  async (
    {email, password, role}: {email: string; password: string; role: string},
    {rejectWithValue},
  ) => {
    try {
      console.log('Login isteği gönderiliyor:', {
        url: `${BASE_URL}/auth/login`,
        data: {email, password, role},
      });

      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email,
          password,
          role,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Login yanıtı:', response.data);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Login hatası:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error,
      });

      if (error.message === 'Network Error') {
        return rejectWithValue(
          'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
        );
      }
      return rejectWithValue(
        error.response?.data?.message || 'Giriş işlemi başarısız oldu',
      );
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      name,
      email,
      password,
      role,
    }: {name: string; email: string; password: string; role: string},
    {rejectWithValue},
  ) => {
    try {
      console.log('Register isteği gönderiliyor:', {
        url: `${BASE_URL}/auth/register`,
        data: {name, email, password, role},
      });

      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Register yanıtı:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register hatası:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error,
      });

      if (error.message === 'Network Error') {
        return rejectWithValue(
          'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
        );
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Kayıt işlemi başarısız oldu',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.userRole = null;
      AsyncStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role as 'librarian' | 'user';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setUserRole, logout} = authSlice.actions;
export default authSlice.reducer;
