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
  return (
    <Layout>
      <Navbar user={user} setUser={setUser} />
      <Layout>
        <Sidebar />
        <Content style={{ margin: "0 24px 0" }}>
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
