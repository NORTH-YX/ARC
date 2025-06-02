import React, { useState } from "react";
import {
  Container,
  Header,
  SprintDateDesktop,
  SprintDateMobile,
  StyledButton,
} from "./elements";
import { Col, Row, Button, Popover, Divider, message } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getSprintStatus, getTimeLineFormat } from "../../../utils";
import { Sprint } from "../../../../../../../../interfaces/sprint";
import { Task, TaskCreate } from "../../../../../../../../interfaces/task";
import TaskComponent from "../taskComponent";
import NewTaskModal from "../newTaskModal";
import useProjectStore from "../../../../../../../../modules/projects/store/useProjectStore";

interface SprintComponentProps {
  sprint: Sprint;
  openSprintModal: () => void;
}

const SprintComponent: React.FC<SprintComponentProps> = ({
  sprint,
  openSprintModal,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const projectStore = useProjectStore();
  const { projectSprints } = projectStore;

  // Find the current sprint's tasks from the store's projectSprints
  const currentSprintTasks = React.useMemo(() => {
    if (!projectSprints || !sprint?.sprintId) return [];
    const currentSprint = projectSprints.find(
      (s) => s.sprintId === sprint.sprintId
    );
    return currentSprint?.tasks || [];
  }, [projectSprints, sprint?.sprintId]);

  const handleCreateTask = async (taskData: TaskCreate) => {
    try {
      if (!sprint?.sprintId) {
        message.error("Sprint ID is required");
        return;
      }

      // Close modal immediately for better UX
      setIsTaskModalOpen(false);

      const result = await projectStore.createTask?.(
        sprint.projectId,
        taskData
      );

      if (!result || !result.taskId) {
        throw new Error("Failed to create task - no result returned");
      }
    } catch (error: any) {
      console.error("Error creating task:", {
        error,
        message: error.message,
        response: error.response,
      });

      const errorMessage =
        error.message ||
        error.response?.message ||
        error.response?.error ||
        "Failed to create task";

      message.error(errorMessage);
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
      <StyledButton
        type="text"
        icon={<PlusOutlined />}
        onClick={() => setIsTaskModalOpen(true)}
      >
        Add Task
      </StyledButton>
      <StyledButton
        type="text"
        icon={<EditOutlined />}
        onClick={openSprintModal}
      >
        Edit
      </StyledButton>
      <StyledButton type="text" icon={<DeleteOutlined />} onClick={() => {}}>
        Delete
      </StyledButton>
    </div>
  );

  return (
    <Container>
      <h3 style={{ color: "#6c6e76" }}>Sprint</h3>
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
      {isTaskModalOpen && (
        <NewTaskModal
          onCancel={() => setIsTaskModalOpen(false)}
          onCreate={handleCreateTask}
          sprintId={sprint?.sprintId}
        />
      )}
      {currentSprintTasks.map((task: Task) => (
        <TaskComponent key={task.taskId} task={task} />
      ))}
    </Container>
  );
};

export default SprintComponent;
