import { Form, Input, Select, DatePicker, Row, Button, Col } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { TaskCreate } from "../../../../../../../../interfaces/task";
import { Container } from "./elements";
//import useUserStore from "../../../../../../../../modules/users/store/useUserStore";

const { Item } = Form;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface NewTaskModalProps {
  onCancel: () => void;
  onCreate: (taskData: TaskCreate) => void;
  sprintId: number;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  onCancel,
  onCreate,
  sprintId,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        taskName: values?.taskName,
        description: values?.description,
        status: values?.status,
        startDate: values?.dates ? values?.dates[0].toISOString() : null,
        dueDate: values?.dates ? values?.dates[1].toISOString() : null,
        priority: values?.priority,
        sprintId: sprintId,
        userId: values?.userId,
        estimatedHours: values?.estimatedHours,
      };

      onCreate(formattedValues);

      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Col>
      <Container>
        <h3 style={{ color: "#6c6e76" }}>Task</h3>
        <Form name="editTask" variant="underlined" form={form}>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <Col span={8}>
              <Item
                name="taskName"
                rules={[
                  { required: true, message: "Please input the task name!" },
                ]}
              >
                <Input placeholder="Task Name" />
              </Item>
            </Col>

            <Col span={14}>
              <Item name="description" style={{ width: "100%" }}>
                <TextArea
                  style={{ width: "100%" }}
                  placeholder="Description"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              gap: "10px",
            }}
          >
            <Col>
              <Item name="dates">
                <RangePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder={["Start Date", "Due Date"]}
                />
              </Item>
            </Col>
            <Col>
              <Item
                name="estimatedHours"
                rules={[
                  { required: true, message: "Please input estimated hours!" },
                ]}
              >
                <Input placeholder="Estimated Hours" type="number" />
              </Item>
            </Col>
            <Col>
              <Item name="status" rules={[{ required: true }]}>
                <Select placeholder="Select status">
                  <Select.Option value="To Do">To Do</Select.Option>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                  <Select.Option value="Blocked">Blocked</Select.Option>
                </Select>
              </Item>
            </Col>
            <Col>
              <Item name="priority">
                <Select placeholder="Priority">
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Item>
            </Col>

            <Col>
              <Item name="userId">
                <Select placeholder="Assign to">
                  <Select.Option value={1}>User 1</Select.Option>
                  <Select.Option value={2}>User 2</Select.Option>
                </Select>
              </Item>
            </Col>
          </Row>
        </Form>
      </Container>
      <Row style={{ gap: "5px", padding: "10px" }}>
        <Button
          style={{ border: "none", borderRadius: "0px", background: "#f9fafb" }}
          type="default"
          icon={<CheckOutlined />}
          onClick={handleOk}
        />
        <Button
          style={{ border: "none", borderRadius: "0px", background: "#f9fafb" }}
          type="default"
          icon={<CloseOutlined />}
          onClick={handleCancel}
        />
      </Row>
    </Col>
  );
};

export default NewTaskModal;
