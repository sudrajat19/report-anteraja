import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import Report from "./pages/user/report/report.jsx";
import Profile from "./pages/user/profile/index.jsx";
import Home from "./pages/user/slider/slider.jsx";
import Satria from "./pages/user/satria/index.jsx";
import Admin from "./pages/dataadmin/home/index.jsx";
import AllStaging from "./pages/dataadmin/staging/index.jsx";
import Employee from "./pages/dataadmin/employee/index.jsx";
import Terminate from "./pages/dataadmin/terminate/index.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/satria",
    element: <Satria />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/allstaging",
    element: <AllStaging />,
  },
  {
    path: "/employee",
    element: <Employee />,
  },
  {
    path: "/terminate",
    element: <Terminate />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
