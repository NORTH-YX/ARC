import styled from "styled-components";
import { Row, Button } from "antd";

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

export const StyledButton = styled(Button)`
  border-radius: 0px;
  text-align: left;
  justify-content: flex-start;
  width: 100%;
`;
