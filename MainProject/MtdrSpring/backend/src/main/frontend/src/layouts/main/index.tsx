import React from "react";
import { Layout } from "antd";
import { User, SetUser } from "../../interfaces/user";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import FooterLayout from "./footer";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Content: AntContent } = Layout;

const Content = styled(AntContent)`
  margin: 0 24px 0;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

interface MainLayoutProps {
  user: User;
  setUser: SetUser;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, setUser, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <Layout>
      <Navbar user={user} onLogout={handleLogout} />
      <Layout>
        <Sidebar />
        <Content>
          <div
            style={{
              minHeight: "100vh",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <FooterLayout />
    </Layout>
  );
};

export default MainLayout;
