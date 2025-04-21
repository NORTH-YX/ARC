import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  ProfileImage,
  TaskRow,
  SprintDateDesktop,
  SprintDateMobile,
  TaskTitle,
  StyledButton,
} from "./elements";
import { Col, Row, Button, Popover, Divider, Checkbox, Tooltip } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  shortenText,
  getTaskStatus,
  getSprintStatus,
  getTimeLineFormat,
  getInitials,
} from "../../../utils";
import { Sprint } from "../../../../../../../../interfaces/sprint";
import { Task } from "../../../../../../../../interfaces/task";
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore";

const isMobile = window.innerWidth <= 600;

const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <StyledButton
        type="text"
        icon={<EyeOutlined />}
        onClick={() => {
          // Handle view task details
        }}
      >
        See Details
      </StyledButton>
      <StyledButton
        type="text"
        icon={<EditOutlined />}
        onClick={() => {
          // Handle edit task
        }}
      >
        Edit
      </StyledButton>
      <StyledButton
        type="text"
        icon={<DeleteOutlined />}
        onClick={() => {
          // Handle delete task
        }}
      >
        Delete
      </StyledButton>
    </div>
  );
  return (
    <TaskRow>
      <Row style={{ display: "flex", gap: "10px" }}>
        <Checkbox checked={task?.status === "Completed" ? true : false} />
        <Tooltip title={task?.taskName} placement="topLeft">
          <TaskTitle completed={task?.status === "Completed"}>
            {shortenText(task?.taskName, isMobile ? 3 : 9)}
          </TaskTitle>
        </Tooltip>
      </Row>
      <Row style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {getTaskStatus(task?.status)}
        <Tooltip title={task?.user?.name} placement="topLeft">
          <ProfileImage> {getInitials(task?.user?.name)} </ProfileImage>
        </Tooltip>
        <Popover
          placement="right"
          title={null}
          content={content}
          arrow={false}
          trigger="click"
          overlayInnerStyle={{ padding: "5px 0px" }}
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

interface SprintComponentProps {
  sprint: Sprint;
}

const SprintComponent: React.FC<SprintComponentProps> = ({ sprint }) => {
  const getActions = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <StyledButton type="text" icon={<EyeOutlined />} onClick={() => {}}>
        See Details
      </StyledButton>
      <StyledButton type="text" icon={<EditOutlined />} onClick={() => {}}>
        Edit
      </StyledButton>
      <StyledButton type="text" icon={<DeleteOutlined />} onClick={() => {}}>
        Delete
      </StyledButton>
    </div>
  );

  const taskStore = useTaskStore();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await taskStore.getTasksBySprint(sprint?.sprintId);
      setTasks(fetchedTasks);
    };
    fetchTasks();
  }, [sprint?.sprintId]);

  console.log("Tasks:", tasks);

  return (
    <Container>
      <Header>
        <Col>
          <h3 style={{ margin: 0 }}>{sprint?.sprintName}</h3>
          <SprintDateDesktop>
            {getTimeLineFormat(
              sprint?.creationDate,
              sprint?.estimatedFinishDate
            )}
          </SprintDateDesktop>
        </Col>
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <SprintDateMobile>
            {getTimeLineFormat(
              sprint?.creationDate,
              sprint?.estimatedFinishDate
            )}
          </SprintDateMobile>
          {getSprintStatus(sprint?.status)}
          <Popover
            placement="right"
            title={null}
            content={getActions}
            arrow={false}
            trigger="click"
            overlayInnerStyle={{ padding: "5px 0px" }}
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
