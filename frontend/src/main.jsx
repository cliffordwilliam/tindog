import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// router
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
// store
import { Provider } from "react-redux";
import { store } from "./store";
// google
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="267165704667-7hon0dg1152bjl995k272q72uftpfglo.apps.googleusercontent.com">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </GoogleOAuthProvider>
);
