import styled from "styled-components";
import { Row } from "antd";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px;
`;

export const StyledRow = styled(Row)`
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`;

export const TitleContainer = styled.div`
  flex: 1;
  margin-right: 20px;

  h1 {
    margin-bottom: 5px;
    font-size: 24px;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #4b5563;
    font-size: 16px;
    word-break: break-word;
  }
  @media only screen and (max-width: 600px) {
    p {
      display: none;
    }
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: auto;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
