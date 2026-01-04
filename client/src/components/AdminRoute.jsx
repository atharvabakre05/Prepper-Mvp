import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';

const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !storedUser.role) {
        setLoading(false);
        return;
      }

      if (storedUser.role === 'admin') {
        setUser(storedUser);
      } else {
        // Verify with server in case local data is stale
        try {
          const response = await api.get('/auth/me');
          if (response.data.role === 'admin') {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Admin check failed:', error);
        }
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
