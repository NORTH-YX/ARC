import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import MainLayout from '../../layouts/main';
import CRM from './routes/crm';
import { useAuth } from '../../contexts/AuthContext';

// por mientras, para meterte a login:
// comentar fakeUser
// // const fakeUser: User = {
// //   id: "1",
// //   name: "John Doe",
// //   email: "john.doe@example.com",
// //   role: "admin", // o "user" dependiendo de lo que necesites
// // };

// eliminar esetado inicial de user
// const Private: React.FC = () => {
//   const [user, setUser] = useState<User | null>();
//   const navigate = useNavigate();

const Private: React.FC = () => {
  const { user, isUserLoading, userError } = useAuthQuery();
  const { logout } = useAuth();

  // Show loading spinner while fetching user data
  if (isUserLoading) {
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
  if (userError || !user) {
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
