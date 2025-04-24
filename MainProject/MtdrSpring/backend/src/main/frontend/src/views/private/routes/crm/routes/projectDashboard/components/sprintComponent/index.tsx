import React from "react";
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
import TaskComponent from "../taskComponent";
import NewTaskModal from "../newTaskModal";
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore";

interface SprintComponentProps {
  sprint: Sprint;
  openSprintModal: () => void;
}

const SprintComponent: React.FC<SprintComponentProps> = ({
  sprint,
  openSprintModal,
}) => {
  const taskStore = useTaskStore();

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
        onClick={() => {
          taskStore.openTaskModal();
        }}
      >
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
      {taskStore?.isTaskModalOpen && (
        <NewTaskModal
          onCancel={taskStore.closeTaskModal}
          onCreate={taskStore.closeTaskModal}
          sprintId={sprint?.sprintId}
        />
      )}
      {sprint?.tasks?.map((task: Task, index: number) => (
        <TaskComponent key={index} task={task} />
      ))}
    </Container>
  );
};
export default SprintComponent;
