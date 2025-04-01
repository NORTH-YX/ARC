import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterLayout: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      ProjectFlow ©{new Date().getFullYear()} Created by A.R.C Consulting
    </Footer>
  );
};

export default FooterLayout;
