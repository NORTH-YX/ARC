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
import useProjectStore from "../../../../../../modules/projects/store/useProjectStore";
import { useSprintBook } from "../../../../../../modules/sprints/hooks/useSprintBook";
import useSprintStore from "../../../../../../modules/sprints/store/useSprintStore";
import { useDataInitialization } from "../../../../../../modules/sprints/hooks/useDataInitialization";

const ProjectDashboard: React.FC = () => {
  const projectStore = useProjectStore();
  const project = projectStore.selectedProject;

  const { data, error, isLoading } = useSprintBook(project?.projectId || 0);
  const sprintStore = useSprintStore();

  useDataInitialization(data, sprintStore);
  if (error) return <div>Failed to load sprints</div>;
  if (isLoading) return <div>Loading...</div>;

  console.log("Sprints Data:", sprintStore?.filteredSprints);
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
          <h1>{project?.projectName}</h1>
          <p>{project?.description}</p>
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
          {sprintStore?.filteredSprints.map((sprint, index) => (
            <SprintComponent key={index} sprint={sprint} />
          ))}
        </SprintsContainer>
        <ProjectDetail />
      </StyledRow>
    </Container>
  );
};
export default ProjectDashboard;
