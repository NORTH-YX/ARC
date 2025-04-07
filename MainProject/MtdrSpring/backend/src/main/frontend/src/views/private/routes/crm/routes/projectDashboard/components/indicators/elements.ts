import styled from "styled-components";
import { Card } from "antd";

export const IndicatorsContainer = styled.div`
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

export const StyledCard = styled(Card)`
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

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const ColumnContainer = styled.div`
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

// Se muestra sólo en móvil y se aplica el color del ícono
export const Value = styled.p<{ color: string }>`
  margin: 0;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    color: ${({ color }) => color};
  }
`;
