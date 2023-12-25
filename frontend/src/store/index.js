import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice.js";

export const store = configureStore({
  reducer: {
    api: apiSlice,
  },
});
