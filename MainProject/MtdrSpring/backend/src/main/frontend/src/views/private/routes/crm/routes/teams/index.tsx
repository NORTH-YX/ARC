import React from "react";
import { User } from "../../../../../../interfaces/user";
import { MemberCard } from "./components/memberCard/index.tsx";
import { TeamTable } from "./components/teamTable/index.tsx";
import { Row, Col, Typography, Button, Space } from "antd";
import { FilterFilled, PlusOutlined } from "@ant-design/icons";
import { employeeTestData } from "./testData.ts";
import { Container, MembersContainer, TitleContainer, CardsContainer } from "./styles.ts";

const { Title } = Typography;


interface TeamsProps {
  user: User;
}

const Teams: React.FC<TeamsProps> = ({ user }) => {
  return (
    <Container>
      <Title level={2} style={{ marginBottom: "5px" }}>Team Leaderboard</Title>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        Performance metrics and rankings for team members
      </p>
      <TeamTable />
      <div style={{ marginTop: "30px" }}>
       <MembersContainer>
       <TitleContainer>
          <h1>Members</h1>
          <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
            {user?.role === 'admin' 
              ? 'Manage your team and its members.' 
              : `Manage your team${user?.teamId ? '' : ' once you are assigned to one'}.`}
          </p>
            
        </TitleContainer>
          <Space size="middle" direction="horizontal">
            <Button icon={<FilterFilled />} style={{ height: "42px" }}>Filter</Button>
            <Button icon={<PlusOutlined />} type="primary" style={{ height: "40px" }} >New Member</Button>
          </Space>
       </MembersContainer>
      <CardsContainer>
        <Row gutter={[28, 28]}>
          {employeeTestData.map((employee, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
              <MemberCard
                name={employee.name}
                jobTitle={employee.jobTitle}
                workHours={employee.workHours}
              />
            </Col>
          ))}
        </Row>
      </CardsContainer>
      </div>
    </Container>
  );
};

export default Teams;

