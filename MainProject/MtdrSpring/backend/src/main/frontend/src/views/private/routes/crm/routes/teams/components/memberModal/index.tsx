import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { User } from "../../../../../../../../interfaces/user";

// Define props for the MemberModal
interface MemberModalProps {
  user: User | undefined;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

}

export const MemberModal: React.FC<MemberModalProps> = ({
  user,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        workModality: user.workModality,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [isModalOpen, user, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("Form submitted with:", values);
      setIsModalOpen(false);
      form.resetFields(); // optional: clear form after submit
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      title={user ? "Change member data" : "Add new member"}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter the email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please enter the role" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Work Modality"
          name="workModality"
          rules={[{ required: true, message: "Please enter the work modality" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
