import React from 'react'
import { StyledCard, StyledButton } from './elements';
import { Avatar, Typography, Space } from 'antd';
import { getInitials } from '../../../utils';
import { ClockCircleOutlined, EditOutlined, MailOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
    name: string;
    jobTitle: string;
    workHours: string;
}

export const MemberCard: React.FC<Props> = ({ name, jobTitle, workHours }) => {
    return (
        <StyledCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Avatar 
                    style={{
                        backgroundColor: '#d9d9d9',
                        color: '#111',
                        fontWeight: 500,
                        height: '64px',
                        width: '64px'
                        
                    }}>{getInitials(name)}
                    </Avatar>
                    <Space size="small" >
                        <StyledButton icon={<EditOutlined />} size='large'></StyledButton>
                        <StyledButton icon={<MailOutlined />} size='large'></StyledButton>
                    </Space>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <Text style={{ fontSize: "medium" }}>{name}</Text> 
                    <Text style={{ color: "#C74634"}}>{jobTitle}</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: "3px", marginTop: "12px" }}>
                    <ClockCircleOutlined />
                    <Text>{workHours}</Text>
                </div>
        </StyledCard>
    );
};
