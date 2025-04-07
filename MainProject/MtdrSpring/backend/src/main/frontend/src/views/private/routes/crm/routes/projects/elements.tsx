import styled, { keyframes } from "styled-components";
import { Card } from "antd";

interface IconWrapperProps {
  bgColor: string;
}

const shine = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const IconWrapper = styled.div<IconWrapperProps>`
  background-color: ${({ bgColor }) => bgColor};
  padding: 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;

  /* Shine animation */
  background-image: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent 100%
  );
  background-size: 200% auto;
  animation: ${shine} 2s linear infinite;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IndicatorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en móviles */
    grid-gap: 10px;
  }
`;

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 100px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 150px;
    height: 50px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: -10px;
  }
`;

const Value = styled.p<{ color: string }>`
  margin: 0;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    color: ${({ color }) => color};
  }
`;

export {
  IconWrapper,
  IndicatorsContainer,
  StyledCard,
  RowContainer,
  ColumnContainer,
  Value,
};
