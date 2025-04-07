import React from "react";
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

interface TaskComponentProps {
  title: string;
  category: string;
  picture?: string;
}

const TaskComponent: React.FC<TaskComponentProps> = ({
  title,
  category,
  picture,
}) => {
  return (
    <TaskRow>
      <Row style={{ display: "flex", gap: "10px" }}>
        <Checkbox />
        <Tooltip title={title} placement="topLeft">
          <h4 style={{ margin: 0 }}>{shortenText(title, isMobile ? 3 : 9)}</h4>
        </Tooltip>
      </Row>
      <Row style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {getTaskCategory(category)}
        {picture ? <ProfileImage src={picture} /> : <ProfileImage />}
        <Popover
          placement="right"
          title={null}
          content={content}
          arrow={false}
          trigger="click"
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
  sprint: SprintData;
}
interface SprintData {
  name: string;
  dateRange: string;
  status: string;
  tasks: TaskComponentProps[];
}

const SprintComponent: React.FC<SprintComponentProps> = ({ sprint }) => {
  return (
    <Container>
      <Header>
        <Col>
          <h3 style={{ margin: 0 }}>{sprint.name}</h3>
          <SprintDateDesktop>{sprint.dateRange}</SprintDateDesktop>
        </Col>
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <SprintDateMobile>{sprint.dateRange}</SprintDateMobile>
          {getStatusTag("In Progress")}
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
      {sprint.tasks.map((task, index) => (
        <TaskComponent
          key={index}
          title={task.title}
          category={task.category}
          picture={task.picture}
        />
      ))}
    </Container>
  );
};
export default SprintComponent;
