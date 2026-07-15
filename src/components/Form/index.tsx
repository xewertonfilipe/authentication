import styled from "styled-components";

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: clamp(16px, 4vw, 24px);
`;

export const FormActions = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
`;
