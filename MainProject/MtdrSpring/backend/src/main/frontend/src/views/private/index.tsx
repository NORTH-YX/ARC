import React from 'react';
import { Spin } from 'antd';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import MainLayout from '../../layouts/main';
import CRM from './routes/crm';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Private: React.FC = () => {
  const { user, isLoading, error } = useAuthQuery();
  const { logout } = useAuth();

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // If there's an error or no user, redirect to login
  if (error || !user) {
    console.log("error", error);
    console.log("user", user);
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, show main layout with CRM
  return (
    <MainLayout user={user} setUser={() => logout()}>
      <CRM user={user} />
    </MainLayout>
  );
};

export default Private;
