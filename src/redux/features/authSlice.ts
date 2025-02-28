import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
          role,
        },
      );
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {email, password, role}: {email: string; password: string; role: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          email,
          password,
          role,
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
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
