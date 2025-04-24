import React, { useEffect, useState } from "react";
import { Row, Button, Spin, Result, Empty } from "antd";
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
import { Link, useParams } from "react-router-dom";
import useProjectStore from "../../../../../../modules/projects/store/useProjectStore";
import NewSprintModal from "./components/newSprintModal";

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams();
  const projectStore = useProjectStore();
  const {
    selectedProject: project,
    projectSprints: sprints,
    isLoadingProjectDetails,
    setProjectWithDetails,
  } = projectStore;

  // State for the sprint modal
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<any>(null);

  // Re-add initialization effect
  useEffect(() => {
    if (projectId) {
      const currentProjectId = parseInt(projectId);

      // If project is not loaded or different from URL, load it with details
      if (!project || project.projectId !== currentProjectId) {
        // Force a complete load of project details to ensure store initialization
        setProjectWithDetails(currentProjectId);
      } else if (projectStore.projectBook === null) {
        // If we have a project but no projectBook, initialize the store
        setProjectWithDetails(currentProjectId);
      }
    }
  }, [projectId, project, setProjectWithDetails, projectStore.projectBook]);

  // Handle loading states
  if (isLoadingProjectDetails) {
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
  }

  // Handle error state - if we have projectId but no project after loading
  if (projectId && !project) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Project not found."
        extra={
          <Link to="/projects">
            <Button type="primary">Go Back</Button>
          </Link>
        }
      />
    );
  }

  // Ensure sprints is always an array
  const sprintsList = Array.isArray(sprints) ? sprints : [];

  // Sprint modal handlers
  const openSprintModal = (sprint?: any) => {
    if (sprint) {
      setSelectedSprint(sprint);
    } else {
      setSelectedSprint(null);
    }
    setIsSprintModalOpen(true);
  };

  const closeSprintModal = () => {
    setIsSprintModalOpen(false);
    setSelectedSprint(null);
  };

  // Sprint operations
  const createSprint = async (sprintData: any) => {
    try {
      // Add project ID to sprint data
      sprintData.projectId = project?.projectId;

      // Call API to create sprint
      // This would normally be in a sprint store, but we'll mock it for now
      console.log("Creating sprint:", sprintData);

      // After creating, refresh project data
      if (project?.projectId) {
        await setProjectWithDetails(project.projectId);
      }

      closeSprintModal();
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const updateSprint = async (sprintId: number, sprintData: any) => {
    try {
      // Call API to update sprint
      console.log("Updating sprint:", sprintId, sprintData);

      // After updating, refresh project data
      if (project?.projectId) {
        await setProjectWithDetails(project.projectId);
      }

      closeSprintModal();
    } catch (error) {
      console.error("Error updating sprint:", error);
    }
  };

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
            onClick={() => openSprintModal()}
          >
            New Sprint
          </Button>
        </ButtonsContainer>
      </StyledRow>
      <IndicatorsContainer>
        <Indicators />
      </IndicatorsContainer>
      <StyledRow>
        <SprintsContainer>
          {isSprintModalOpen && (
            <NewSprintModal
              visible={isSprintModalOpen}
              onCancel={closeSprintModal}
              onCreate={(sprintData) => {
                createSprint(sprintData);
              }}
              onEdit={(sprintData) => {
                if (selectedSprint) {
                  updateSprint(selectedSprint.sprintId, sprintData);
                }
              }}
              sprint={selectedSprint}
            />
          )}
          {sprintsList.length > 0 ? (
            sprintsList.map((sprint, index) => (
              <SprintComponent
                key={index}
                sprint={sprint}
                openSprintModal={() => {
                  openSprintModal(sprint);
                }}
              />
            ))
          ) : (
            <Empty description="No sprints found" />
          )}
        </SprintsContainer>
        <ProjectDetail />
      </StyledRow>
    </Container>
  );
};
export default ProjectDashboard;
