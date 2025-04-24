import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Row, Button, Col } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Sprint,
  SprintCreate,
  SprintUpdate,
} from "../../../../../../../../interfaces/sprint";
import { Container } from "./elements";

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
    <Col>
      <Container>
        <h3 style={{ color: "#6c6e76" }}>Sprint</h3>
        <Form
          name="editSprint"
          variant="underlined"
          form={form}
          onFinish={(values) => {
            if (sprint) {
              onEdit({ ...sprint, ...values });
            }
          }}
        >
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Item
              name="sprintName"
              rules={[
                { required: true, message: "Please input the sprint name!" },
              ]}
            >
              <Input placeholder="Sprint Name" />
            </Item>
            <Item name="dates" rules={[{ required: true }]}>
              <RangePicker format="MMM DD, YYYY" style={{ width: "100%" }} />
            </Item>
            <Item name="status" rules={[{ required: true }]}>
              <Select placeholder="Select status">
                <Select.Option value="Active">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Planned">Planned</Select.Option>
                <Select.Option value="on-hold">On Hold</Select.Option>
              </Select>
            </Item>
          </Row>
        </Form>
      </Container>
      <Row style={{ gap: "5px", padding: "10px" }}>
        <Button
          style={{ border: "none", borderRadius: "0px" }}
          type="default"
          icon={<CheckOutlined />}
          onClick={handleOk}
        />
        <Button
          style={{ border: "none", borderRadius: "0px" }}
          type="default"
          icon={<CloseOutlined />}
          onClick={handleCancel}
        />
      </Row>
    </Col>
  );
};

export default NewSprintModal;
