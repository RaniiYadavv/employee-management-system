import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

const storedUser = localStorage.getItem('ems_user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('ems_token') || null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const extractErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.errors?.[0]?.msg ||
  'Something went wrong. Please try again.';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', formData);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', formData);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        applyAuthPayload(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        applyAuthPayload(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

function applyAuthPayload(state, payload) {
  const { token, ...user } = payload;
  state.user = user;
  state.token = token;
  localStorage.setItem('ems_token', token);
  localStorage.setItem('ems_user', JSON.stringify(user));
}

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
