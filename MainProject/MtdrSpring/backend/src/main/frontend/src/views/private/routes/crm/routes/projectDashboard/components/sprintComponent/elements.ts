import styled from "styled-components";
import { Avatar, Row, Tag, Button } from "antd";

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  background-color: rgb(255, 255, 255);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 13px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const Header = styled(Row)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProfileImage = styled(Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c74634;
`;

export const TaskRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 12px 0px 12px 12px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    background-color: #f3f4f6;
  }
`;

export const ResponsiveTag = styled(Tag)`
  border-radius: 4px;
  border: none;
  padding: 5px 14px;
  height: fit-content;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const SprintDateDesktop = styled.p`
  margin: 0;
  color: #6b7280;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const SprintDateMobile = styled.p`
  margin-top: 0;
  margin-right: 10px;

  color: #6b7280;

  @media (min-width: 601px) {
    display: none;
  }
`;

export const TaskTitle = styled.h4<{ completed?: boolean }>`
  margin: 0;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#9CA3AF" : "#111827")};
`;

export const StyledButton = styled(Button)`
  border-radius: 0px;
  text-align: left;
  justify-content: flex-start;
  width: 100%;
`;
