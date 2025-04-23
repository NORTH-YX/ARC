import React from "react";
import { User } from "../../../../../../interfaces/user";
import { MemberCard } from "./components/memberCard/index.tsx";
import { TeamTable } from "./components/teamTable/index.tsx";
import { Row, Col, Typography, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Container, MembersContainer, TitleContainer, CardsContainer } from "./styles.ts";
import { MemberModal } from "./components/memberModal/index.tsx";
import { FilterButton } from "./components/filterButton/index.tsx";
import { useUserBook } from "../../../../../../modules/users/hooks/useUserBook.ts";
import useUserStore from "../../../../../../modules/users/store/useUserStore.ts";
import { useKpisBook } from "../../../../../../modules/kpis/hooks/useKpisBook.ts";
import { useKpiStore } from "../../../../../../modules/kpis/store/useKpiStore.ts";
import { useTeamInitialization } from "../../../../../../hooks/useTeamInitialization.ts";



const { Title } = Typography;

interface TeamsProps {
  user: User;
}


const Teams: React.FC<TeamsProps> = ({ user }) => {
  const { data: usersData } = useUserBook();
  const { data: kpisData } = useKpisBook();

  const userStore = useUserStore();
  const kpiStore = useKpiStore();

  useTeamInitialization(usersData, kpisData, userStore, kpiStore);


  const showModal = () => {
    userStore.openUserModal();
  };


  return (
    <Container>
      <Title level={2} style={{ marginBottom: "5px" }}>Team Leaderboard</Title>
      <p style={{ color: "#6B7280", marginBottom: "40PX" }}>
        Performance metrics and rankings for team members
      </p>
      <TeamTable teamMembers={userStore.filteredUsers} complianceRate={kpiStore.kpis?.compliance_rate.users} estimationPrecision={kpiStore.kpis?.estimation_precision.users}/>
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
            <FilterButton roleFilter={userStore.roleFilter} workModalityFilter={userStore.workModalityFilter} setRoleFilter={userStore.setRoleFilter}
               setWorkModalityFilter={userStore.setWorkModalityFilter} />
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
        {userStore.filteredUsers
          .filter((employee) => {
            const roleMatch =
              userStore.roleFilter.length === 0 ||
              userStore.roleFilter.includes(employee.role); // replace with your actual field name
            const modalityMatch =
              userStore.workModalityFilter.length === 0 ||
              userStore.workModalityFilter.includes(employee.workModality); // replace with your actual field name
            return roleMatch && modalityMatch;
          })
          .map((employee, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
              <MemberCard user={employee} />
            </Col>
          ))}
      </Row>
    </CardsContainer>

      </div>
      <MemberModal user={undefined} isModalOpen={userStore.isUserModalOpen} setIsModalOpen={userStore.closeUserModal} />
    </Container>
  );
};

export default Teams;

