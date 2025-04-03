import React, { useState } from "react";
import {
  HomeFilled,
  TeamOutlined,
  DashboardFilled,
  FolderFilled,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./elements.css";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: "1",
    icon: <HomeFilled />,
    label: "Dashboard",
    path: "/dashboard"
  },
  {
    key: "2",
    icon: <FolderFilled />,
    label: "Projects",
    path: "/projects"
  },
  {
    key: "3",
    icon: <TeamOutlined />,
    label: "Teams",
    path: "/teams"
  },
  {
    key: "4",
    icon: <DashboardFilled />,
    label: "Reports",
    path: "/reports"
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(() => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => currentPath.startsWith(item.path));
    return menuItem?.key || "1";
  });

  const handleMenuClick = (item: MenuItem) => {
    setSelectedKey(item.key);
    navigate(item.path);
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="50"
      style={{ backgroundColor: "white" }}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          const item = menuItems.find(i => i.key === key);
          if (item) handleMenuClick(item);
        }}
        items={menuItems}
        className="custom-menu"
        style={{ marginTop: "20px" }}
      />
    </Sider>
  );
};

export default Sidebar;
