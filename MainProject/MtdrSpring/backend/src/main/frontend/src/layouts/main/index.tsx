import React from "react";
import { Layout, theme } from "antd";
import { User, SetUser } from "../../interfaces/user";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import FooterLayout from "./footer";

const { Content } = Layout;

interface MainLayoutProps {
  user: User;
  setUser: SetUser;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, setUser, children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Navbar user={user} setUser={setUser} />
      <Layout>
        <Sidebar />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
