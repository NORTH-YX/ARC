import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Col, Row, Button, Avatar, Popconfirm } from "antd";
import { User } from "../../../../interfaces/user";

interface PopViewProps {
  user: User;
  onLogout?: () => void;
}
const getInitials = (name: string): string => {
  const names = name.split(" ");
  const initials = names
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
  return initials;
};

const PopView: React.FC<PopViewProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Popconfirm
      title={
        <Col
          style={{
            gap: "15px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Row
            style={{
              gap: "15px",
              alignItems: "center",
              width: "100%",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Avatar
              size={70}
              style={{
                backgroundColor: "red",
              }}
            >
              {getInitials(user?.name) || "JD"}
            </Avatar>
            <Col style={{ textAlign: "left", gap: 0 }}>
              <h2 style={{ margin: 0, padding: 0 }}>
                {user?.name || "Jonh Doe"}
              </h2>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                  color: "#4b5563",
                  fontSize: "12px",
                }}
              >
                {user?.email || "Jonh.Doe@gmail.com"}
              </p>
              <a
                href="/profile"
                style={{
                  margin: 0,
                  padding: 0,
                  color: "#4b5563",
                  textDecoration: "underline",
                  fontSize: "12px",
                }}
              >
                Ver Perfil
              </a>
            </Col>
          </Row>
          <Row
            style={{
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              color="danger"
              variant="filled"
              style={{ fontSize: "15px", width: "100%" }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Row>
        </Col>
      }
      placement="bottom"
      okText="Logout"
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      icon={null}
    >
      <Avatar
        style={{
          backgroundColor: "red",
          cursor: "pointer",
        }}
      >
        {getInitials(user?.name) || "JD"}
      </Avatar>
    </Popconfirm>
  );
};

export default PopView;
