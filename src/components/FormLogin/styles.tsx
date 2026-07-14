import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.25);
`;

export const Image = styled.img`
  margin: 0 auto;
  max-width: fit-content;
`;

export const Figure = styled.figure`
  margin: 0;
  display: flex;
  justify-content: center;
`;

export const Heading = styled.h2`
  margin: 32px 0;
  font-size: 20px;
  font-weight: 700;
`;

export const HeadingWarning = styled.h2`
  margin: 32px 0;
  color: #ff5031;
  font-size: 20px;
  font-weight: 700;
`;
