import React from "react";
import ColorStrip from "../../../assets/ColorStrip.png";
import Logo from "../../../assets/logo.svg";
import { BellOutlined, MailOutlined } from "@ant-design/icons";
import { Layout, Col, Row, Button } from "antd";
import PopView from "./components/PopView";
import { User } from "../../../interfaces/user";

const { Header } = Layout;

interface NavbarProps {
  user: User;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <Header
      style={{
        padding: 0,
        height: "auto",
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Col style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <img
            src={ColorStrip}
            alt="header image"
            style={{ width: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "10px 30px 10px 20px",
          }}
        >
          <Row
            style={{
              alignItems: "center",
              height: "fit-content",
              gap: "10px",
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ height: "35px", borderRadius: "1px" }}
            />
            <h2
              style={{
                margin: 0,
                padding: 0,
                lineHeight: "35px",
                fontWeight: 400,
              }}
            >
              ProjectFlow
            </h2>
          </Row>
          <Row
            style={{
              alignItems: "center",
              height: "fit-content",
              gap: "10px",
            }}
          >
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: "15px" }}
            />
            <Button
              type="text"
              icon={<MailOutlined />}
              style={{ fontSize: "15px" }}
            />
            <PopView user={user} onLogout={onLogout} />
          </Row>
        </div>
      </Col>
    </Header>
  );
};

export default Navbar;
