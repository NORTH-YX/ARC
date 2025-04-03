import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import AuthLayout from '../../layouts/auth';
import Auth from './routes/auth';

const Public: React.FC = () => {
  const { user, isLoading, login } = useAuthQuery();

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'white',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Redirect authenticated users to home
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <Auth setUser={login} />
    </AuthLayout>
  );
};

export default Public;
