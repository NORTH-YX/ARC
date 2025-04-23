import React from "react";
import { Row, Button, Spin, Result } from "antd";
import {
  Container,
  StyledRow,
  ButtonsContainer,
  TitleContainer,
  IndicatorsContainer,
  SprintsContainer,
} from "./styles";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import ProjectDetail from "./components/projectDetail";
import SprintComponent from "./components/sprintComponent";
import Indicators from "./components/indicators";
import { Link } from "react-router-dom";
import useProjectStore from "../../../../../../modules/projects/store/useProjectStore";
import { useSprintBook } from "../../../../../../modules/sprints/hooks/useSprintBook";
import useSprintStore from "../../../../../../modules/sprints/store/useSprintStore";
import { useDataInitialization } from "../../../../../../modules/sprints/hooks/useDataInitialization";
import NewSprintModal from "./components/newSprintModal";

const ProjectDashboard: React.FC = () => {
  const projectStore = useProjectStore();
  const project = projectStore.selectedProject;

  const { data, error, isLoading } = useSprintBook(project?.projectId || 0);
  const sprintStore = useSprintStore();

  useDataInitialization(data, sprintStore);
  if (error) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Failed to load sprints."
        extra={
          <Link to="/projects">
            <Button type="primary">Go Back</Button>
          </Link>
        }
      />
    );
  }
  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );

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
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={sprintStore?.openSprintModal}
          >
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
          {sprintStore?.isSprintModalOpen && (
            <NewSprintModal
              visible={sprintStore?.isSprintModalOpen}
              onCancel={sprintStore?.closeSprintModal}
              onCreate={(sprintData) => {
                sprintStore.createSprint(sprintData);
                sprintStore.closeSprintModal;
              }}
              onEdit={(sprintData) => {
                if (sprintStore?.selectedSprint) {
                  sprintStore.updateSprint(
                    sprintStore?.selectedSprint?.sprintId,
                    sprintData
                  );
                  sprintStore.closeSprintModal;
                }
              }}
              sprint={sprintStore?.selectedSprint}
            />
          )}
          {sprintStore?.filteredSprints
            .slice()
            .reverse()
            .map((sprint, index) => (
              <SprintComponent
                key={index}
                sprint={sprint}
                openSprintModal={() => {
                  sprintStore.openSprintModal();
                  sprintStore.setSelectedSprint(sprint);
                }}
              />
            ))}
        </SprintsContainer>
        <ProjectDetail />
      </StyledRow>
    </Container>
  );
};
export default ProjectDashboard;
