import React from 'react';
import { Spin } from 'antd';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import AuthLayout from '../../layouts/auth';
import Auth from './routes/auth';

const Public: React.FC = () => {
  const { user, isUserLoading, userError, login } = useAuthQuery();

  console.log("Public component loaded", { user, isUserLoading, userError });

  // Show loading spinner while fetching user data
  if (isUserLoading) {
    console.log("User data is loading...");
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

  return (
    <AuthLayout>
      <Auth setUser={login} />
    </AuthLayout>
  );
};

export default Public;
