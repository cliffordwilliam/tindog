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
    },
  },
});

export const { start, ok, bad } = apiSlice.actions;

export function request({
  method,
  url,
  options,
  callback,
  isStart = false, // see loader
  isEnd = false, // see success dialog
}) {
  return async function (dispatch) {
    try {
      if (isStart) {
        document.querySelector("dialog").showModal();
      }
      dispatch(start());
      const res = await axios({
        method,
        url,
        ...options,
        data: options.data,
      });
      document.querySelector("dialog").close(); // in case it was opened
      dispatch(ok(res.data));
      callback(res.data);
      if (isEnd) {
        document.querySelector("dialog").showModal();
      }
    } catch (error) {
      if (error.response === undefined) {
        console.log(error);
        dispatch(bad("error"));
      } else {
        dispatch(bad(error.response.data.message));
      }
      document.querySelector("dialog").showModal(); // error modal is always going to be opened
    }
  };
}

export default apiSlice.reducer;
