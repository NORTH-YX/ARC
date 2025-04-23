import React, { useState } from "react";
import {
  ProfileImage,
  TaskRow,
  TaskInput,
  TaskInputNumber,
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
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore";
const isMobile = window.innerWidth <= 600;

const TASK_STATUSES = ["To Do", "In Progress", "Completed", "Blocked"];

interface TaskComponentProps {
  task: Task;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [taskNameValue, setTaskNameValue] = useState(task?.taskName || "");
  const [originalTaskName, setOriginalTaskName] = useState(
    task?.taskName || ""
  );
  const taskStore = useTaskStore();

  const handleFocus = () => {
    setIsInputFocused(true);
    // Save the original name when focusing, to be able to restore it if canceled
    setOriginalTaskName(task?.taskName || "");
  };

  const handleCancel = () => {
    setTaskNameValue(originalTaskName);
    setIsInputFocused(false);
  };

  const handleSave = () => {
    if (task?.taskId && taskNameValue !== originalTaskName) {
      taskStore.updateTask?.(task.taskId, { taskName: taskNameValue });
    }
    setIsInputFocused(false);
  };

  const handleStatusChange = (value: unknown) => {
    if (task?.taskId) {
      taskStore.updateTask?.(task.taskId, { status: value as string });
    }
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
          // Set focus to the task name input
          setIsInputFocused(true);
        }}
      >
        Edit
      </StyledButton>
      <StyledButton
        type="text"
        icon={<DeleteOutlined />}
        onClick={() => {
          // Handle delete task
          if (task?.taskId) {
            taskStore.deleteTask?.(task.taskId);
          }
        }}
      >
        Delete
      </StyledButton>
    </div>
  );

  // If task is null or undefined, don't render anything
  if (!task) return null;

  return (
    <TaskRow>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Checkbox
          checked={task.status === "Completed"}
          onChange={(e) => {
            if (task.taskId) {
              taskStore.updateTask?.(task.taskId, {
                status: e.target.checked ? "Completed" : "To Do",
              });
            }
          }}
        />
        <TaskInput
          autoSize
          completed={task.status === "Completed"}
          value={isMobile ? shortenText(taskNameValue, 3) : taskNameValue}
          onChange={(e) => setTaskNameValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={(e) => {
            if (!e.relatedTarget) {
              setIsInputFocused(false);
              if (taskNameValue !== originalTaskName) {
                setTaskNameValue(originalTaskName);
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
        <span
          style={{ fontSize: "12px", color: "#6B7280", marginRight: "4px" }}
        >
          Est:
        </span>
        <Tooltip title="Estimated hours">
          <TaskInputNumber
            size="small"
            min={1}
            max={100000}
            value={task?.estimatedHours || ""}
            onChange={(e) => {
              if (task?.taskId) {
                const value = e ? Number(e) : null;
                taskStore.updateTask?.(task.taskId, {
                  estimatedHours: value,
                });
              }
            }}
          />
        </Tooltip>

        <span
          style={{ fontSize: "12px", color: "#6B7280", marginRight: "4px" }}
        >
          Real:
        </span>
        <Tooltip title="Actual hours spent">
          <TaskInputNumber
            size="small"
            min={1}
            max={99}
            value={task?.realHours || ""}
            onChange={(e) => {
              if (task?.taskId) {
                const value = e ? Number(e) : null;
                taskStore.updateTask?.(task.taskId, {
                  realHours: value,
                });
              }
            }}
          />
        </Tooltip>

        <SelectWrapper>
          {task.taskId && (
            <StyledSelect
              className="status-select"
              rootClassName={`status-${task?.status
                .toLowerCase()
                .replace(" ", "-")}`}
              value={task?.status}
              onChange={handleStatusChange}
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
          )}
        </SelectWrapper>
        <Tooltip title={task.user?.name} placement="topLeft">
          <ProfileImage> {getInitials(task.user?.name)} </ProfileImage>
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
