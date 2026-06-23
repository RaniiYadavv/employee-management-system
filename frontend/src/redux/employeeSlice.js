import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

const extractErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.errors?.[0]?.msg ||
  'Something went wrong. Please try again.';

const initialState = {
  items: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  filters: { search: '', department: '', sortBy: 'createdAt', order: 'desc' },
  status: 'idle', // idle | loading | succeeded | failed
  mutationStatus: 'idle',
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().employees;
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      const { data } = await axiosInstance.get('/employees', { params });
      return data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/employees', employeeData);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/employees/${id}`, employeeData);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setDepartmentFilter: (state, action) => {
      state.filters.department = action.payload;
      state.pagination.page = 1;
    },
    setSort: (state, action) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.order = action.payload.order;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.mutationStatus = 'succeeded';
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearch, setDepartmentFilter, setSort, setPage, clearEmployeeError } =
  employeeSlice.actions;
export default employeeSlice.reducer;
