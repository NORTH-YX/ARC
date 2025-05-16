import React from "react";
import { Form, Input, Button, Checkbox, Row, Col, Typography, Card, Image } from "antd";
import { LoginCredentials } from "../../../../../api/auth";
import { useNavigate } from "react-router-dom";
import { StyledLink, StyledImage } from "../elements";
import { UserOutlined, LockFilled } from "@ant-design/icons";

const { Text, Title } = Typography;

interface LoginProps {
  setUser: (credentials: LoginCredentials) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();

  const handleFormSubmit = (values: LoginCredentials) => {
    setUser(values);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        backgroundColor: "#C74634",
        margin: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Col
        xs={0} // Hide on extra small screens
        sm={0} // 10/24 width on small screens
        md={12} // 12/24 width on medium screens
        lg={12} // Half screen on large screens
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <StyledImage>
        <Image
          src="https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?cs=srgb&dl=pexels-vojtech-okenka-127162-392018.jpg&fm=jpg"
          preview={false}
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            borderRadius: "0 16px 16px 0",
            display: "block",
          }}
        />
        </StyledImage>
      </Col>
      <Col
        xs={24}
        sm={16}
        md={12}
        lg={12}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "16px",
            justifyContent: "center",
            alignItems: "center",
            margin: "30px",
            width: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Title level={2}>Sign in</Title>
            <Text type="secondary">Please login to continue</Text>

            <Form
              name="basic"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 32 }}
              onFinish={handleFormSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ width: "100%" }}
              
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
                <Input prefix={<UserOutlined style={{ color: "gray" }}/>}/>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password prefix={<LockFilled style={{ color: "gray" }} />} />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{ span: 24 }}
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <StyledLink
                  style={{ paddingTop: "4px" }}
                  onClick={() => navigate("/recover")}
                >
                  Forgot password?
                </StyledLink>
              </div>

              <Form.Item wrapperCol={{ span: 32 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", backgroundColor: "#C74634" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
              <Text>Don't have an account?</Text>
              <StyledLink onClick={() => navigate("/create")}>Sign up</StyledLink>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
