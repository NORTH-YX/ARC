import React from "react";
import { User } from "../../../../../../interfaces/user";
import { Row, Button } from "antd";
import {
    Container,
    StyledRow,
    ButtonsContainer,
    TitleContainer,
} from "./styles";
import { PlusOutlined } from "@ant-design/icons";

const ProjectDashboard: React.FC<{ user: User }> = ({ user }) => {
  const canCreateItems = user?.role === 'admin' || user?.role === 'project_manager';
  
  return (
    <Container>
      <Row>
        <a href="projects"> Go Back</a>
      </Row>
      <StyledRow>
        <TitleContainer>
          <h1>Project Dashboard</h1>
          <p>Sprint Planning and Task Management for {user?.name || 'your'} projects</p>
        </TitleContainer>
        {canCreateItems && (
          <ButtonsContainer>
            <Button icon={<PlusOutlined />} type="primary">
              New Sprint
            </Button>
            <Button icon={<PlusOutlined />} type="primary">
              New Task
            </Button>
          </ButtonsContainer>
        )}
      </StyledRow>
    </Container>
  );
};
export default ProjectDashboard;
