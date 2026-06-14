import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AdminRoute } from "./components/AdminRoute.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Analytics } from "./pages/Analytics.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { Users } from "./pages/Users.jsx";
import { Settings } from "./pages/Settings.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export const App = () => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};
