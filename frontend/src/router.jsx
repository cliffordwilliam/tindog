import React from "react";
// router
import { createBrowserRouter, redirect } from "react-router-dom";
// layout
import Private from "./layouts/Private.jsx";
import Public from "./layouts/Public.jsx";
import Global from "./layouts/Global.jsx";
// pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ConfirmEmail from "./pages/ConfirmEmail.jsx";
import Terms from "./pages/Terms.jsx";
import Guidelines from "./pages/Guidelines.jsx";

const router = createBrowserRouter([
  {
    element: <Global />,
    children: [
      {
        element: <Private />,
        loader: () => {
          if (!localStorage.token) {
            return redirect("/register");
          }
          return null;
        },
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
      {
        element: <Public />,
        children: [
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/verify-email/:email",
            element: <VerifyEmail />,
          },
          {
            path: "/confirm-email/:token",
            element: <ConfirmEmail />,
          },
          {
            path: "/terms",
            element: <Terms />,
          },
          {
            path: "/guidelines",
            element: <Guidelines />,
          },
        ],
      },
    ],
  },
]);

// export
export default router;
