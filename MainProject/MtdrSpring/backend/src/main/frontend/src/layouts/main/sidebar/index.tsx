import React, { useState } from "react";
import {
  HomeFilled,
  TeamOutlined,
  DashboardFilled,
  FolderFilled,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "./elements.css";

const { Sider } = Layout;

const items: { [key: string]: React.ComponentType } = {
  Dashboard: HomeFilled,
  Projects: FolderFilled,
  Teams: TeamOutlined,
  Reports: DashboardFilled,
};

const menuItems = Object.keys(items).map((label, index) => ({
  key: String(index + 1),
  icon: React.createElement(items[label]),
  label: label,
}));

const Sidebar: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("1");

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
        onClick={(e) => setSelectedKey(e.key)}
        items={menuItems}
        className="custom-menu"
        style={{ marginTop: "20px" }}
      />
    </Sider>
  );
};

export default Sidebar;
