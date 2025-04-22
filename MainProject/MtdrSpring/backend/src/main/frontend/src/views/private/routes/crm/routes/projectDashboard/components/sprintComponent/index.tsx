import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  SprintDateDesktop,
  SprintDateMobile,
  StyledButton,
} from "./elements";
import { Col, Row, Button, Popover, Divider } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getSprintStatus, getTimeLineFormat } from "../../../utils";
import { Sprint } from "../../../../../../../../interfaces/sprint";
import { Task } from "../../../../../../../../interfaces/task";
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore";
import TaskComponent from "../taskComponent";

interface SprintComponentProps {
  sprint: Sprint;
  openSprintModal: () => void;
}

const SprintComponent: React.FC<SprintComponentProps> = ({
  sprint,
  openSprintModal,
}) => {
  const taskStore = useTaskStore();

  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskNameChange = async (newName: string | null, task: Task) => {
    try {
      await taskStore.updateTask?.(task?.taskId, { taskName: newName });
    } catch (error) {
      console.error("Error updating task name:", error);
    }
  };
  const handleStatusChange = async (newStatus: string, task: Task) => {
    try {
      await taskStore.updateTask?.(task.taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getActions = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <StyledButton type="text" icon={<PlusOutlined />} onClick={() => {}}>
        Add Task
      </StyledButton>
      <StyledButton
        type="text"
        icon={<EditOutlined />}
        onClick={() => {
          openSprintModal();
        }}
      >
        Edit
      </StyledButton>
      <StyledButton type="text" icon={<DeleteOutlined />} onClick={() => {}}>
        Delete
      </StyledButton>
    </div>
  );

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
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            overlayInnerStyle={{ padding: "5px 0px", borderRadius: "3px" }}
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
        <TaskComponent
          key={index}
          task={task}
          handleTaskNameChange={handleTaskNameChange}
          handleStatusChange={handleStatusChange}
          OldTaskName={taskStore?.OldTaskName}
          setOldTaskName={taskStore.setOldTaskName}
        />
      ))}
    </Container>
  );
};
export default SprintComponent;
