import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// router
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
// store
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
);
