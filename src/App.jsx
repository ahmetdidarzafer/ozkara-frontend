// filepath: /d:/Development/Web Development/Ozkara-Motor-Yaglari/frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from './components/ProtectedRoute';
import Profile from "./pages/Profile";
import ToastContainer from './components/ToastContainer';
import UserAppointments from "./pages/UserAppointments";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const tokenExpiration = decodedToken.exp * 1000;
        
        if (tokenExpiration > Date.now()) {
          setIsAuthenticated(true);
          setUserRole(storedUserRole);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Router>
      <Layout>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <UserAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                loading={loading}
                userRole={userRole}
                role="admin"
              >
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;