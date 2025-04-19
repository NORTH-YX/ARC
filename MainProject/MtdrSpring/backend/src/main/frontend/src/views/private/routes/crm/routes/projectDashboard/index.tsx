import React from "react";
import { Row, Button } from "antd";
import {
  Container,
  StyledRow,
  ButtonsContainer,
  TitleContainer,
  IndicatorsContainer,
  SprintsContainer,
} from "./styles";
import { PlusOutlined } from "@ant-design/icons";
import ProjectDetail from "./components/projectDetail";
import SprintComponent from "./components/sprintComponent";
import Indicators from "./components/indicators";
import { Link } from "react-router-dom";

interface TaskComponentProps {
  title: string;
  category: string;
  picture?: string;
}
interface SprintData {
  name: string;
  dateRange: string;
  status: string;
  tasks: TaskComponentProps[];
}

const sprintsData: SprintData[] = [
  {
    name: "Sprint 1 - UI Implementation",
    dateRange: "Feb 1 - Feb 14, 2025",
    status: "In Progress",
    tasks: [
      {
        title:
          "Design Login Page lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        category: "Design",
        picture: "https://via.placeholder.com/32",
      },
      {
        title: "Develop API Endpoints",
        category: "Backend",
      },
    ],
  },
  {
    name: "Sprint 2 - Feature Enhancement",
    dateRange: "Feb 15 - Mar 1, 2025",
    status: "To Do",
    tasks: [
      {
        title: "Improve Dashboard UI",
        category: "Development",
      },
      {
        title: "Database Schema Design",
        category: "Database",
        picture: "https://via.placeholder.com/32",
      },
    ],
  },
];

const ProjectDashboard: React.FC = () => {
  return (
    <Container>
      <Row>
        <Link to="/projects">
          <p
            style={{
              color: "#C74634",
              textDecoration: "underline",
              fontSize: "1.1rem",
            }}
          >
            Go Back
          </p>
        </Link>
      </Row>
      <StyledRow>
        <TitleContainer>
          <h1>Project Dashboard</h1>
          <p>Sprint Planning and Task Management</p>
        </TitleContainer>
        <ButtonsContainer>
          <Button icon={<PlusOutlined />} type="primary">
            New Sprint
          </Button>
          <Button icon={<PlusOutlined />} type="primary">
            New Task
          </Button>
        </ButtonsContainer>
      </StyledRow>
      <IndicatorsContainer>
        <Indicators />
      </IndicatorsContainer>
      <StyledRow>
        <SprintsContainer>
          {sprintsData.map((sprint, index) => (
            <SprintComponent key={index} sprint={sprint} />
          ))}
        </SprintsContainer>
        <ProjectDetail />
      </StyledRow>
    </Container>
  );
};
export default ProjectDashboard;
