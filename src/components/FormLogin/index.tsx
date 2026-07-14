import { useEffect } from "react";

import loginImg from "../../assets/imgs/login.png";
import {
  clearAuthError,
  clearStoredToken,
  loginUser,
  resetAuthState,
  selectAuthError,
  selectAuthStatus,
  selectCredentials,
  setCredentialField,
} from "../../features/auth/auth";
import type { LoginCredentials } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button } from "../Button";
import { Fieldset } from "../Fieldset";
import { Form, FormActions } from "../Form";
import { FormLabel } from "../FormLabel";
import { TextField } from "../TextField";
import { Figure, Heading, HeadingWarning, Image, Section } from "./styles";

interface FormLoginProps {
  navigateTo: () => void;
}

export const FormLogin = ({ navigateTo }: FormLoginProps) => {
  const dispatch = useAppDispatch();
  const credentials = useAppSelector(selectCredentials);
  const errorMessage = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    clearStoredToken();
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errorMessage) {
      dispatch(clearAuthError());
    }
    dispatch(
      setCredentialField({
        field: name as keyof LoginCredentials,
        value,
      })
    );
  };

  const submitLogin = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    dispatch(loginUser(credentials))
      .unwrap()
      .then(() => {
        navigateTo();
      })
      .catch(() => undefined);
  };

  return (
    <Section>
      <Figure>
        <Image src={loginImg} />
      </Figure>
      <Heading>Preencha os campos abaixo para efetuar login!</Heading>
      <Form onSubmit={submitLogin}>
        <Fieldset>
          <FormLabel>Email</FormLabel>
          <TextField
            name="email"
            type="email"
            placeholder="Digite seu email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </Fieldset>
        <Fieldset>
          <FormLabel>Senha</FormLabel>
          <TextField
            name="password"
            type="password"
            placeholder="Digite sua senha"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </Fieldset>
        <FormActions>
          <Button type="submit" disabled={authStatus === "loading"}>
            {authStatus === "loading" ? "Efetuando login..." : "Efetuar login"}
          </Button>
        </FormActions>
      </Form>
      {errorMessage && <HeadingWarning>{errorMessage}</HeadingWarning>}
    </Section>
  );
};
