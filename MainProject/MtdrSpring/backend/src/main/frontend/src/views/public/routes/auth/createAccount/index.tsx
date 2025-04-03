import { Form, Button, Input } from "antd";

const CreateAccount = () => {
  return (
    <div>
      <Form name="basic" layout="vertical">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button>Create Account</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAccount;
