# setup react in root

```bash
npm create vite@latest
```

# update the package.json

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-oauth/google": "^0.12.1",
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "react-spotify-web-playback": "^0.14.1",
    "redux": "^5.0.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.0.8"
  }
}
```

# npm i

```
npm i
```

# c.js

```js
export default class c {
  static baseUrl = "http://localhost:3000";
}
```

# imports.js

```js
import React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { request } from "./store/apiSlice.js";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import c from "./c.js";
// components
import PrivateHeader from "./components/PrivateHeader.jsx";
import PublicHeader from "./components/PublicHeader.jsx";
import Footer from "./components/Footer.jsx";

const imports = {
  React,
  useEffect,
  useState,
  Outlet,
  useDispatch,
  useSelector,
  request,
  useParams,
  Link,
  useNavigate,
  io,
  c,
  PrivateHeader,
  PublicHeader,
  Footer,
};

export default imports;
```

# store dir

## apiSlice.js

```js
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
```

## index.js

```js
import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice.js";

export const store = configureStore({
  reducer: {
    api: apiSlice,
  },
});
```

# components dir

## Footer.jsx

```jsx
import imports from "../imports.js";

export default function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Tindog. All rights reserved.</p>
    </footer>
  );
}
```

## PrivateHeader.jsx

```jsx
import imports from "../imports.js";

export default function PrivateHeader() {
  return (
    <header>
      <h1>PrivateHeader</h1>
    </header>
  );
}
```

## PublicHeader.jsx

```jsx
import imports from "../imports.js";

export default function PublicHeader() {
  return (
    <header>
      <h1>PublicHeader</h1>
    </header>
  );
}
```

# layouts dir

## Global.jsx

```jsx
import imports from "../imports.js";

export default function Global() {
  return (
    <>
      <imports.Outlet />
    </>
  );
}
```

## Private.jsx

```jsx
import imports from "../imports.js";

export default function Private() {
  return (
    <>
      <imports.PrivateHeader />
      <imports.Outlet />
      <imports.Footer />
    </>
  );
}
```

## Public.jsx

```jsx
import imports from "../imports.js";

export default function Public() {
  return (
    <>
      <imports.PublicHeader />
      <imports.Outlet />
      <imports.Footer />
    </>
  );
}
```

# pages dir

## Register.jsx

```jsx
import imports from "../imports.js";

export default function Register() {
  return (
    <main>
      <h2>Register</h2>
    </main>
  );
}
```

## Login.jsx

```jsx
import imports from "../imports.js";

export default function Login() {
  return (
    <main>
      <h2>Login</h2>
    </main>
  );
}
```

## Home.jsx

```jsx
import imports from "../imports.js";

export default function Home() {
  return (
    <main>
      <h2>Home</h2>
    </main>
  );
}
```

# router.jsx

```jsx
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

const Router = createBrowserRouter([
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
        ],
      },
    ],
  },
]);

// export
export default Router;
```

# main.jsx

```jsx
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
```

# delete uneeded app and css

Empty the index.css, use it for yourself.

Remove:

- App.jsx
- App.css

# update index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Site name here</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

# update site icon with ico file in the public folder, delete the vite svg

