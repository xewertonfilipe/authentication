import { useEffect, useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";

import loginImg from "../../assets/imgs/login.png";
import http from "../../http";
import type {
  AuthErrorResponse,
  AuthTokenResponse,
  LoginCredentials,
} from "../../interfaces";
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
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errorMessage) {
      setErrorMessage("");
    }
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name as keyof LoginCredentials]: value,
    }));
  };

  const loginUser = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    http
      .post<AuthTokenResponse>("/auth/token", credentials)
      .then((response: AxiosResponse<AuthTokenResponse>) => {
        sessionStorage.setItem("token", response.data.accessToken);
        navigateTo();
      })
      .catch((error: AxiosError<AuthErrorResponse>) => {
        if (error?.response?.status === 401) {
          setErrorMessage("Dados inválidos. Verifique e tente novamente.");
          return;
        }

        setErrorMessage(
          "Não foi possível realizar o login. Tente novamente em instantes."
        );
      });
  };

  return (
    <Section>
      <Figure>
        <Image src={loginImg} />
      </Figure>
      <Heading>Preencha os campos abaixo para efetuar login!</Heading>
      <Form onSubmit={loginUser}>
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
          <Button type="submit">Efetuar login</Button>
        </FormActions>
      </Form>
      {errorMessage && <HeadingWarning>{errorMessage}</HeadingWarning>}
    </Section>
  );
};
