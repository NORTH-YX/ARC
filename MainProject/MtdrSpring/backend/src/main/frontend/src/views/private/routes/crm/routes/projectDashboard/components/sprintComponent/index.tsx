import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  ProfileImage,
  TaskRow,
  ResponsiveTag,
  SprintDateDesktop,
  SprintDateMobile,
} from "./elements";
import { Col, Row, Button, Popover, Divider, Checkbox, Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { getStatusTag, shortenText } from "../../../utils";
import { Sprint } from "../../../../../../../../interfaces/sprint";
import { Task } from "../../../../../../../../interfaces/task";
import { getTasks } from "../../../../../../../../api/tasks";

const isMobile = window.innerWidth <= 600;

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const getTaskCategory = (category: string) => {
  let bgcolor;
  let textColor = "black";

  switch (category) {
    case "Design":
      bgcolor = "#DBEAFE";
      textColor = "#1E40AF";
      break;
    case "Development":
      bgcolor = "#EDE9FE";
      textColor = "#5B21B6";
      break;
    case "Backend":
      bgcolor = "#D1FAE5";
      textColor = "#065F46";
      break;
    case "Database":
      bgcolor = "#FFEDD5";
      textColor = "#9A3412";
      break;
    default:
      bgcolor = "gray";
  }

  return (
    <ResponsiveTag color={bgcolor}>
      <p style={{ color: textColor, fontSize: "12px", margin: 0 }}>
        {category}
      </p>
    </ResponsiveTag>
  );
};

const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <TaskRow>
      <Row style={{ display: "flex", gap: "10px" }}>
        <Checkbox />
        <Tooltip title={task?.taskName} placement="topLeft">
          <h4 style={{ margin: 0 }}>
            {shortenText(task?.taskName, isMobile ? 3 : 9)}
          </h4>
        </Tooltip>
      </Row>
      <Row style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {getTaskCategory(task?.status)}
        {task?.taskId ? <ProfileImage src={task?.taskId} /> : <ProfileImage />}
        <Popover
          placement="right"
          title={null}
          content={content}
          arrow={false}
          trigger="click"
          overlayInnerStyle={{ padding: "0px", margin: "0px" }}
        >
          <Button
            style={{
              fontSize: "20px",
              color: "#9CA3AF",
            }}
            type="link"
            icon={<MoreOutlined />}
          />
        </Popover>
      </Row>
    </TaskRow>
  );
};

const SprintComponent: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (sprint && sprint.sprintId) {
      // getTasks.bySprint devuelve una promesa, por eso se usa async/await
      const fetchTasks = async () => {
        try {
          const response = await getTasks.bySprint(sprint.sprintId);
          // Suponiendo que response contiene una propiedad tasks de tipo Task[]
          setTasks(response.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchTasks();
    }
  }, [sprint]);

  return (
    <Container>
      <Header>
        <Col>
          <h3 style={{ margin: 0 }}>{sprint?.sprintName}</h3>
          <SprintDateDesktop>{sprint?.estimatedFinishDate}</SprintDateDesktop>
        </Col>
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <SprintDateMobile>{sprint?.estimatedFinishDate}</SprintDateMobile>
          {getStatusTag(sprint?.status)}
          <Popover
            placement="right"
            title={null}
            content={content}
            arrow={false}
            trigger="click"
          >
            <Button
              style={{ fontSize: "24px", color: "#9CA3AF" }}
              type="link"
              icon={<MoreOutlined />}
            />
          </Popover>
        </Row>
      </Header>
      <Divider style={{ margin: "15px 0" }} />
      {tasks.map((task, index) => (
        <TaskComponent key={index} task={task} />
      ))}
    </Container>
  );
};
export default SprintComponent;
