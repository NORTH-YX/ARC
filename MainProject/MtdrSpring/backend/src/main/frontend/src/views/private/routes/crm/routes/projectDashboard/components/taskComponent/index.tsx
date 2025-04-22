import React, { useState } from "react";
import {
  ProfileImage,
  TaskRow,
  TaskInput,
  StyledButton,
  StyledSelect,
  SelectWrapper,
} from "./elements";
import { Row, Button, Popover, Checkbox, Tooltip } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { shortenText, getInitials, getStatusTag } from "../../../utils";
import { Task } from "../../../../../../../../interfaces/task";
const isMobile = window.innerWidth <= 600;

const TASK_STATUSES = ["To Do", "In Progress", "Completed", "Blocked"];

interface TaskComponentProps {
  task: Task;
  handleTaskNameChange: (newName: string | null, task: Task) => void;
  handleStatusChange: (newStatus: string, task: Task) => void;
  OldTaskName: string | null;
  setOldTaskName: (taskName: string | null) => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({
  task,
  handleTaskNameChange,
  handleStatusChange,
  OldTaskName,
  setOldTaskName,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [taskNameValue, setTaskNameValue] = useState(task?.taskName || "");

  const handleFocus = () => {
    setIsInputFocused(true);
    setOldTaskName(task?.taskName);
  };

  const handleCancel = () => {
    setTaskNameValue(OldTaskName || task?.taskName);
    setIsInputFocused(false);
  };

  const handleSave = () => {
    handleTaskNameChange(taskNameValue, task);
    setIsInputFocused(false);
  };

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
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Checkbox checked={task?.status === "Completed" ? true : false} />
        <TaskInput
          autoSize
          completed={task?.status === "Completed"}
          value={isMobile ? shortenText(taskNameValue, 3) : taskNameValue}
          onChange={(e) => setTaskNameValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={(e) => {
            if (!e.relatedTarget) {
              setIsInputFocused(false);
              if (taskNameValue !== OldTaskName) {
                setTaskNameValue(OldTaskName || task?.taskName);
              }
            }
          }}
        />
        {isInputFocused && (
          <Row style={{ gap: "5px" }}>
            <Button
              style={{ border: "none", borderRadius: "0px" }}
              type="default"
              icon={<CheckOutlined />}
              onClick={handleSave}
            />
            <Button
              style={{ border: "none", borderRadius: "0px" }}
              type="default"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            />
          </Row>
        )}
      </Row>
      <Row style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <SelectWrapper>
          <StyledSelect
            className="status-select"
            rootClassName={`status-select-${task?.status
              .toLowerCase()
              .replace(" ", "-")}`}
            value={task?.status}
            onChange={(value) => handleStatusChange(value as string, task)}
            getPopupContainer={(triggerNode) =>
              triggerNode.parentNode as HTMLElement
            }
            dropdownClassName="status-select-dropdown"
            options={TASK_STATUSES.map((statusOption) => {
              const optionInfo = getStatusTag(statusOption);
              return {
                value: statusOption,
                label: optionInfo.label,
              };
            })}
          />
        </SelectWrapper>
        <Tooltip title={task?.user?.name} placement="topLeft">
          <ProfileImage> {getInitials(task?.user?.name)} </ProfileImage>
        </Tooltip>
        <Popover
          placement="right"
          title={null}
          content={content}
          arrow={false}
          trigger="click"
          overlayInnerStyle={{ padding: "5px 0px", borderRadius: "3px" }}
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

export default TaskComponent;
