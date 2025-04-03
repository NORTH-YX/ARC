import styled from "styled-components";

interface IconWrapperProps {
    bgColor: string;
  }
  
   const IconWrapper = styled.div<IconWrapperProps>`
    background-color: ${({ bgColor }) => bgColor};
    padding: 8px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 43px;
  `;

export { IconWrapper };