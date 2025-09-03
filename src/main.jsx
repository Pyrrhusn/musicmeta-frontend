import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar.jsx";
import NotFound from "./components/NotFound.jsx";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme.js";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Genres from "./pages/genres/Genres.jsx";
import Songs from "./pages/songs/Songs.jsx";
import Artist from "./pages/users/Artist.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Register from "./pages/Register.jsx";
import AddOrEditSong from "./pages/songs/AddOrEditSong.jsx";
import Playlists from "./pages/playlists/Playlists.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthProvider } from "./contexts/Auth.context.jsx";

const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate to="songs" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "songs",
        element: <Songs />,
      },
      {
        path: "songs/add",
        element: <PrivateRoute requireAdmin={true} requireArtist={true} />,
        children: [
          {
            index: true,
            element: <AddOrEditSong />,
          },
        ],
      },
      {
        path: "songs/edit/:id",
        element: <PrivateRoute requireAdmin={true} requireArtist={true} />,
        children: [
          {
            index: true,
            element: <AddOrEditSong />,
          },
        ],
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "artists",
        children: [
          {
            path: ":id",
            element: <Artist />,
          },
          {
            path: "me",
            element: <PrivateRoute requireArtist={true} />,
            children: [
              {
                index: true,
                element: <Artist />,
              },
            ],
          },
        ],
      },
      {
        path: "playlists",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Playlists />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
