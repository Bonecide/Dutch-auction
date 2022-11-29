import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from './slices/AuthSlices';




export const store = configureStore({
  reducer: {
    auth: authSlice,
  }
})

