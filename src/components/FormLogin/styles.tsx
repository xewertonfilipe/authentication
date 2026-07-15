import styled from "styled-components";

export const Section = styled.section`
  width: min(100%, 560px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 6vw, 32px);
  border-radius: 8px;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.25);
`;

export const Image = styled.img`
  margin: 0 auto;
  width: min(100%, 320px);
  height: auto;
`;

export const Figure = styled.figure`
  margin: 0;
  display: flex;
  justify-content: center;
`;

export const Heading = styled.h2`
  margin: clamp(20px, 5vw, 32px) 0;
  font-size: clamp(18px, 4.5vw, 20px);
  text-align: center;
  font-weight: 700;
`;

export const HeadingWarning = styled.h2`
  margin: clamp(20px, 5vw, 32px) 0;
  color: #ff5031;
  font-size: clamp(18px, 4.5vw, 20px);
  text-align: center;
  font-weight: 700;
`;
