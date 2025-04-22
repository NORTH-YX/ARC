import React from "react";
import { User } from "../../../../../../interfaces/user";
import { MemberCard } from "./components/memberCard/index.tsx";
import { TeamTable } from "./components/teamTable/index.tsx";
import { Row, Col, Typography, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { employeeTestData } from "./testData.ts";
import { Container, MembersContainer, TitleContainer, CardsContainer } from "./styles.ts";
import { MemberModal } from "./components/memberModal/index.tsx";
import { FilterButton } from "./components/filterButton/index.tsx";
import { useUserBook } from "../../../../../../modules/users/hooks/useUserBook.ts";
import useUserStore from "../../../../../../modules/users/store/useUserStore.ts";
import { useDataInitialization } from "../../../../../../modules/users/hooks/useDataInitialization.ts";
import { useState } from "react";

const { Title } = Typography;

interface TeamsProps {
  user: User;
}


const Teams: React.FC<TeamsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, isLoading } = useUserBook();
  const store = useUserStore();

  useDataInitialization(data, store)
  console.log(store.filteredUsers)


  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Title level={2} style={{ marginBottom: "5px" }}>Team Leaderboard</Title>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        Performance metrics and rankings for team members
      </p>
      <TeamTable teamMembers={store.filteredUsers}/>
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
        {user?.role !== 'admin' && (
          <Space size="middle" direction="horizontal">
            <FilterButton></FilterButton>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ height: "40px" }}
              onClick={showModal}
            >
              New Member
            </Button>
          </Space>
        )}
       </MembersContainer>
      <CardsContainer>
        <Row gutter={[28, 28]}>
          {employeeTestData.map((employee, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
              <MemberCard
                user={employee} />
            </Col>
          ))}
        </Row>
      </CardsContainer>
      </div>
      <MemberModal user={undefined} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Container>
  );
};

export default Teams;

