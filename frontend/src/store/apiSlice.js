import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiSlice = createSlice({
  name: "api",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    start: (state, action) => {
      if (process.env.NODE_ENV === "development") {
        console.log("START", action.payload);
      }
      state.loading = true;
      state.data = null;
      state.error = null;
    },
    ok: (state, action) => {
      if (process.env.NODE_ENV === "development") {
        console.log("OK", action.payload);
      }
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    bad: (state, action) => {
      if (process.env.NODE_ENV === "development") {
        console.log("BAD", action.payload);
      }
      state.loading = false;
      state.data = null;
      state.error = action.payload;
      //   show modal here
    },
  },
});

export const { start, ok, bad } = apiSlice.actions;

export function request({ method, url, options, callback, isModal = false }) {
  return async function (dispatch) {
    try {
      if (isModal) {
        // show modal here
      }
      dispatch(start());
      const res = await axios({
        method,
        url,
        ...options,
        data: options.data,
      });
      dispatch(ok(res.data));
      callback(res.data);
    } catch (error) {
      dispatch(bad(error.response.data.message));
    }
  };
}

export default apiSlice.reducer;
