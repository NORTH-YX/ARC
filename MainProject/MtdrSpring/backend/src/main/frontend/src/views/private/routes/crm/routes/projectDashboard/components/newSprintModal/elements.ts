import styled, { keyframes } from "styled-components";

const popOut = keyframes`
  from {
    opacity: 0;
    transform: scale(0.99) translateY(-2px);
  }
  50% {
    opacity: 1;
    transform: scale(1.01) translateY(0);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const Container = styled.div`
  width: auto;
  border: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  border-radius: 2px;
  background-color: #ffffff;
  padding: 10px 20px 0px 20px;

  animation: ${popOut} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  &:hover {
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
    border-radius: 2px;
    transition: all 0.2s ease-in-out;
  }
`;
