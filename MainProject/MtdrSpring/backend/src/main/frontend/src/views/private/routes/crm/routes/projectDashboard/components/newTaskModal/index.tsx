import { Form, Input, Select, DatePicker, Row, Button, Col } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { TaskCreate } from "../../../../../../../../interfaces/task";
import { Container } from "./elements";
import useUserStore from "../../../../../../../../modules/users/store/useUserStore";
import { useDataInitialization } from "../../../../../../../../modules/users/hooks/useDataInitialization";
import { useUserBook } from "../../../../../../../../modules/users/hooks/useUserBook";


const { Item } = Form;
const { TextArea } = Input;




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

   const { data } = useUserBook()
  
    const store = useUserStore();
  
    useDataInitialization(data, store)

    const users = data?.users || [];

  const [form] = Form.useForm();

const handleOk = () => {
  form.validateFields().then((values) => {
    const priorityMap: Record<string, number> = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    const formattedValues = {
      taskName: values?.taskName,
      description: values?.description,
      priority: priorityMap[values?.priority] ?? 0, // fallback por si algo falla
      status: values?.status,
      estimatedFinishDate: values?.dates ? values?.dates.toISOString() : null,
      estimatedHours: Number(values?.estimatedHours),
      user: { userId: values?.userId },
      sprint: { sprintId: sprintId },
      realFinishDate: null,
      realHours: null,
      deletedAt: null,
    };

    console.log("🧩 Formatted task to create:", formattedValues);
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
                <DatePicker
                  style={{ width: "100%" }}
                  format="MMM D, YYYY h:mm a"
                  showTime // <-- Esto habilita la selección de hora
                  placeholder={"Estimated finish date"}
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
              <Item name="userId" rules={[{ required: true, message: "Please assign a user!" }]}>
                <Select placeholder="Assign to">
                  {users.map((user) => (
                    <Select.Option key={user.userId} value={user.userId}>
                      {user.name}
                    </Select.Option>
                  ))}
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
