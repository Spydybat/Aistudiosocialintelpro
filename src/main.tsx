import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import DownloadHistory from "./pages/DownloadHistory.tsx";
import SavedExports from "./pages/SavedExports.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <App initialView="profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download-history"
            element={
              <ProtectedRoute>
                <App initialView="download-history" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-exports"
            element={
              <ProtectedRoute>
                <App initialView="saved-exports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
