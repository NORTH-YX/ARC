import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import moment from "moment";
import {
  Sprint,
  SprintCreate,
  SprintUpdate,
} from "../../../../../../../../interfaces/sprint";
import ImgArt from "../../../../../../../../assets/OracleArt2.png";
import ImgArt2 from "../../../../../../../../assets/OracleArt1.avif";

const { Item } = Form;
const { RangePicker } = DatePicker;

interface EditProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  sprint: Sprint | null;
  onEdit: (sprintData: SprintUpdate) => void;
  onCreate: (sprintData: SprintCreate) => void;
}

const NewSprintModal: React.FC<EditProjectModalProps> = ({
  visible,
  onCancel,
  sprint,
  onEdit,
  onCreate,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        sprintName: values?.sprintName,
        status: values?.status,
        creationDate: values?.dates[0].toISOString(),
        estimatedFinishDate: values?.dates[1].toISOString(),
      };

      if (sprint) {
        onEdit({ ...sprint, ...formattedValues });
      } else {
        onCreate(formattedValues);
      }
      form.resetFields();
    });
  };

  useEffect(() => {
    if (sprint) {
      form.setFieldsValue({
        sprintName: sprint?.sprintName,
        dates:
          sprint?.creationDate && sprint?.estimatedFinishDate
            ? [
                moment(sprint?.creationDate),
                moment(sprint?.estimatedFinishDate),
              ]
            : null,
        status: sprint?.status,
      });
    }
  }, [sprint, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title=""
      visible={visible}
      onOk={handleOk}
      okText={sprint ? "Save" : "Create"}
      onCancel={handleCancel}
    >
      {sprint ? null : (
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
        {sprint ? "Edit " + sprint?.sprintName : "Create New Sprint"}
      </h2>
      <Form
        style={{ marginTop: "20px" }}
        name="editSprint"
        variant="filled"
        form={form}
        onFinish={(values) => {
          if (sprint) {
            onEdit({ ...sprint, ...values });
          }
        }}
      >
        <Item
          label="Sprint Name"
          name="sprintName"
          rules={[{ required: true, message: "Please input the sprint name!" }]}
        >
          <Input />
        </Item>
        <Item label="Sprint Timeline" name="dates" rules={[{ required: true }]}>
          <RangePicker format="MMM DD, YYYY" style={{ width: "100%" }} />
        </Item>
        <Item label="Status" name="status" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            <Select.Option value="Active">In Progress</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Planned">Planned</Select.Option>
            <Select.Option value="on-hold">On Hold</Select.Option>
          </Select>
        </Item>
      </Form>
      {sprint ? (
        <img
          src={ImgArt}
          alt="Sprint Image"
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

export default NewSprintModal;
