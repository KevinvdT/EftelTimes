import { configureStore } from '@reduxjs/toolkit';
import queueReducer from './queueSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    queue: queueReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
}); 