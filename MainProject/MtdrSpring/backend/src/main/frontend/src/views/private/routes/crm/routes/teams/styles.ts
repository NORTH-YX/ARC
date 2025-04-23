import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px;
`;

const MembersContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;

    @media only screen and (max-width: 600px) {
      flex-direction: column;
      margin-bottom: 16px;
  }
`;

const TitleContainer = styled.div`
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

const CardsContainer = styled.div`
    padding-right: 120px;
    padding-left: 30px;

    @media only screen and (max-width: 600px) {
      padding-right: 16px;
      padding-left: 16px;
  }
`;

export { Container, MembersContainer, TitleContainer, CardsContainer }