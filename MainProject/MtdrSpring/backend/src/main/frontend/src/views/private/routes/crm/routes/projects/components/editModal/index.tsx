import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import moment from "moment";
import {
  Project,
  ProjectCreate,
  ProjectUpdate,
} from "../../../../../../../../interfaces/project";
import ImgArt from "../../../../../../../../assets/OracleArt2.png";
import ImgArt2 from "../../../../../../../../assets/OracleArt1.avif";

const { Item } = Form;
const { RangePicker } = DatePicker;

interface EditProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  project: Project | null;
  onEdit: (projectData: ProjectUpdate) => void;
  onCreate: (projectData: ProjectCreate) => void;
  confirmLoading: boolean;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  onCancel,
  project,
  onEdit,
  onCreate,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        projectName: values?.projectName,
        description: values?.description,
        status: values?.status,
        startDate: values?.dates[0].toISOString(),
        estimatedFinishDate: values?.dates[1].toISOString(),
      };

      if (project) {
        onEdit({ ...project, ...formattedValues });
      } else {
        onCreate(formattedValues);
      }
      form.resetFields();
    });
  };

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        projectName: project?.projectName,
        description: project?.description,
        dates:
          project?.startDate && project?.estimatedFinishDate
            ? [moment(project?.startDate), moment(project?.estimatedFinishDate)]
            : null,
        status: project?.status,
      });
    }
  }, [project, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title=""
      visible={visible}
      onOk={handleOk}
      okText={project ? "Save" : "Create"}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {project ? null : (
        <img
          src={ImgArt2}
          alt="Project Image"
          style={{
            width: "40%",
            height: "auto",
            marginTop: "10px",
            objectFit: "cover",
          }}
        />
      )}
      <h2 style={{ textAlign: "center", fontWeight: "500" }}>
        {project ? "Edit " + project?.projectName : "Create New Project"}
      </h2>
      <Form
        style={{ marginTop: "20px" }}
        name="editProject"
        variant="filled"
        form={form}
        onFinish={(values) => {
          if (project) {
            onEdit({ ...project, ...values });
          }
        }}
      >
        <Item
          label="Project Name"
          name="projectName"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Item>
        <Item label="Team Members" name="teamMembers">
          <Select mode="multiple" placeholder="Select team members">
            <Select.Option value="member1">Member 1</Select.Option>
            <Select.Option value="member2">Member 2</Select.Option>
            <Select.Option value="member3">Member 3</Select.Option>
          </Select>
        </Item>
        <Item
          label="Project Timeline"
          name="dates"
          rules={[{ required: true }]}
        >
          <RangePicker format="MMM DD, YYYY" style={{ width: "100%" }} />
        </Item>
        <Item label="Status" name="status" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            <Select.Option value="Active">In Progress</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="on-hold">On Hold</Select.Option>
          </Select>
        </Item>
      </Form>
      {project ? (
        <img
          src={ImgArt}
          alt="Project Image"
          style={{
            width: "35%",
            height: "auto",
            marginTop: "10px",
            objectFit: "cover",
          }}
        />
      ) : null}
    </Modal>
  );
};

export default EditProjectModal;
