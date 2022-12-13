import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const URL_API = 'http://localhost:4000/';

const initialState = {
  tasks: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  try {
    const response = await axios.get(`${URL_API}tasks`);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedTasks = action.payload;
        state.tasks = loadedTasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllTasks = (state) => state.tasks;
export const getTasksStatus = (state) => state.status;
export const getTasksError = (state) => state.error;
export default tasksSlice.reducer;
