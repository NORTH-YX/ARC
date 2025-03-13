import React from "react";
import { Space, Button, Tag } from "antd";
import { StyledTable } from "./elements";
import { format } from "date-fns";

interface DataType {
  key: React.Key;
  taskId: number;
  taskName: string;
  status: string;
  sprint: string;
  creationDate: string;
  estimatedFinishDate: string;
  priority: number;
  user: string;
  realFinishDate: string | null;
}

const data: DataType[] = [
  {
    key: "1",
    taskId: 70,
    taskName: "Run automated and manual tests",
    status: "To Do",
    sprint: "Sprint 3",
    creationDate: "2025-03-03T09:00:00Z",
    estimatedFinishDate: "2025-03-09T18:00:00Z",
    priority: 2,
    user: "Gerardo Garcia",
    realFinishDate: null,
  },
  {
    key: "2",
    taskId: 71,
    taskName: "Update project documentation",
    status: "To Do",
    sprint: "Sprint 3",
    creationDate: "2025-03-03T09:00:00Z",
    estimatedFinishDate: "2025-03-09T18:00:00Z",
    priority: 3,
    user: "Gerardo Garcia",
    realFinishDate: null,
  },
  {
    key: "3",
    taskId: 64,
    taskName: "Define strategy and defect types",
    status: "To Do",
    sprint: "Sprint 4",
    creationDate: "2025-03-13T04:40:04Z",
    estimatedFinishDate: "2025-03-14T04:40:04Z",
    priority: 2,
    user: "Gerardo Garcia",
    realFinishDate: null,
  },
  {
    key: "4",
    taskId: 65,
    taskName: "Record and edit presentation",
    status: "To Do",
    sprint: "Sprint 4",
    creationDate: "2025-03-13T04:40:04Z",
    estimatedFinishDate: "2025-03-14T04:40:04Z",
    priority: 3,
    user: "Gerardo Garcia",
    realFinishDate: null,
  },
];

const getStatusTag = (status: string) => {
  let color;
  switch (status) {
    case "To Do":
      color = "blue";
      break;
    case "In Progress":
      color = "orange";
      break;
    case "Completed":
      color = "green";
      break;
    default:
      color = "gray";
  }
  return (
    <Tag
      style={{ borderRadius: "10px", border: "none", padding: "7px 15px" }}
      color={color}
    >
      {status}
    </Tag>
  );
};

const TasksTable: React.FC = () => (
  <StyledTable dataSource={data}>
    <StyledTable.ColumnGroup
      title={
        <div
          style={{
            marginTop: "-10px",
            marginLeft: "-13px",
            padding: "10px",
            borderRadius: "8px 8px 0 0",
            backgroundColor: "white",
            width: "101%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <h2 style={{ margin: 0 }}>Recent Tasks</h2>
        </div>
      }
    >
      <StyledTable.Column
        title="Task Name"
        dataIndex="taskName"
        key="taskName"
      />
      <StyledTable.Column
        title="Status"
        dataIndex="status"
        key="status"
        render={(status: string) => getStatusTag(status)}
      />
      <StyledTable.Column title="Sprint" dataIndex="sprint" key="sprint" />
      <StyledTable.Column
        title="Creation Date"
        dataIndex="creationDate"
        key="creationDate"
        render={(date: string) => format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
      />
      <StyledTable.Column
        title="Estimated Finish"
        dataIndex="estimatedFinishDate"
        key="estimatedFinishDate"
        render={(date: string) => format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
      />
      <StyledTable.Column
        title="Priority"
        dataIndex="priority"
        key="priority"
      />
      <StyledTable.Column title="User" dataIndex="user" key="user" />
      <StyledTable.Column
        title="Real Finish"
        dataIndex="realFinishDate"
        key="realFinishDate"
        render={(date: string | null) =>
          date ? format(new Date(date), "yyyy-MM-dd HH:mm:ss") : "Not Finished"
        }
      />
      <StyledTable.Column
        title="Action"
        key="action"
        render={(_: any, record: DataType) => (
          <Space size="middle">
            <Button type="primary">Edit</Button>
            <Button danger>Delete</Button>
          </Space>
        )}
      />
    </StyledTable.ColumnGroup>
  </StyledTable>
);

export default TasksTable;
