import styled from "styled-components";
import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const Container = styled.div`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
`;

export const Title = styled.h3`
  margin-bottom: 16px;
`;

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

export const Label = styled.span`
  color: #6b7280;
  font-size: 12px;
`;

export const Value = styled.span``;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProfileImage = styled(Avatar).attrs({
  icon: React.createElement(UserOutlined),
})`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 12px;
  background-color: #c74634;
`;

interface IconWrapperProps {
  bgColor?: string;
}

export const IconWrapper = styled.div<IconWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor || "#e6ffed"};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
`;
