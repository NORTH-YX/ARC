import styled from "styled-components";
import { Avatar, Tag, Button, Input, Select, InputNumber } from "antd";

const { TextArea } = Input;

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

export const TaskInput = styled(TextArea).attrs({
  variant: "borderless",
})<{ completed?: boolean }>`
  margin: 0;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#9CA3AF" : "#000000")};
  width: auto;
  min-width: 120px;
  flex: 1;

  &:focus {
    text-decoration: none;
    color: #000000;
  }

  &:focus-within {
    border: 1px solid #d9d9d9;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    border-radius: 2px;
    padding: 4px 11px;
  }

  &.ant-input-focused {
    border: 1px solid #d9d9d9;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    border-radius: 2px;
    padding: 4px 11px;
  }

  @media (min-width: 600px) {
    width: 300px;
`;
export const TaskInputNumber = styled(InputNumber).attrs({
  variant: "borderless",
  controls: false, // Elimina las flechas para ahorrar espacio
  maxLength: 2, // Limita a 2 caracteres
})<{}>`
  margin: 0;
  width: 40px; // Ancho fijo pequeño
  min-width: 40px; // Min-width igual al width para consistencia
  text-align: center;
  padding: 0 2px;

  &:focus {
    text-decoration: none;
    color: #000000;
  }

  &:focus-within {
    border: 1px solid #d9d9d9;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    border-radius: 2px;
    padding: 0 2px;
  }

  &.ant-input-focused {
    border: 1px solid #d9d9d9;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    border-radius: 2px;
    padding: 0 2px;
  }

  /* Este CSS oculta las flechas de incremento/decremento en navegadores */
  .ant-input-number-handler-wrap {
    display: none;
  }

  /* Para webkit browsers como Chrome y Safari */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Para Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  @media (min-width: 600px) {
    width: 40px; // Mantener el mismo tamaño en pantallas más grandes
  }
`;

export const StyledButton = styled(Button)`
  border-radius: 0px;
  text-align: left;
  justify-content: flex-start;
  width: 100%;
`;

export const StyledSelect = styled(Select)`
  &.ant-select .ant-select-selector {
    border: none;
    box-shadow: none;
  }

  &.status-to-do .ant-select-selector {
    background-color: #dbeafe;
    color: #0c4a6e;
  }

  &.status-in-progress .ant-select-selector {
    background-color: #fef3c7;
    color: #92400e;
  }

  &.status-completed .ant-select-selector {
    background-color: #d1fae5;
    color: #065f46;
  }

  &.status-blocked .ant-select-selector {
    background-color: #fee2e2;
    color: #7f1d1d;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export const HoursContainer = styled.div`
  @media (max-width: 800px) {
    display: none;
  }
`;

export const SelectWrapper = styled.div`
  .ant-select-dropdown {
    .ant-select-item-option-selected {
      background-color: #f3f4f6;
    }

    .ant-select-item-option:hover {
      background-color: #f9fafb;
    }
  }
`;
