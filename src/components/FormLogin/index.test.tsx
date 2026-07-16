import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import auth from "../../features/auth/auth";
import http from "../../http";
import { FormLogin } from ".";

jest.mock("../../http", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      auth,
    },
  });

describe("FormLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clears token on mount", () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
    const store = createTestStore();

    render(
      <Provider store={store}>
        <FormLogin navigateTo={jest.fn()} />
      </Provider>
    );

    expect(removeItemSpy).toHaveBeenCalledWith("token");
  });

  it("logs in successfully and navigates to home", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    const navigateTo = jest.fn();
    const store = createTestStore();

    mockedHttp.post.mockResolvedValue({ data: { accessToken: "token-123" } });

    render(
      <Provider store={store}>
        <FormLogin navigateTo={navigateTo} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu email/i), {
      target: { name: "email", value: "maria@bytebank.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Efetuar login/i }));

    await waitFor(() => {
      expect(mockedHttp.post).toHaveBeenCalledWith("/auth/token", {
        email: "maria@bytebank.com",
        password: "123456",
      });
      expect(setItemSpy).toHaveBeenCalledWith("token", "token-123");
      expect(navigateTo).toHaveBeenCalledTimes(1);
    });
  });

  it("shows invalid credentials message for 401", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };
    const store = createTestStore();

    mockedHttp.post.mockRejectedValue({ response: { status: 401 } });

    render(
      <Provider store={store}>
        <FormLogin navigateTo={jest.fn()} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu email/i), {
      target: { name: "email", value: "maria@bytebank.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { name: "password", value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Efetuar login/i }));

    expect(
      await screen.findByText(
        /Dados invalidos\. Verifique e tente novamente\./i
      )
    ).toBeInTheDocument();
  });

  it("shows generic error message when login fails unexpectedly", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };
    const store = createTestStore();

    mockedHttp.post.mockRejectedValue(new Error("network"));

    render(
      <Provider store={store}>
        <FormLogin navigateTo={jest.fn()} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu email/i), {
      target: { name: "email", value: "maria@bytebank.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Efetuar login/i }));

    expect(
      await screen.findByText(
        /Nao foi possivel realizar o login\. Tente novamente em instantes\./i
      )
    ).toBeInTheDocument();
  });

  it("shows loading spinner and keeps submit disabled while auth is loading", () => {
    const mockedHttp = http as unknown as { post: jest.Mock };
    const store = createTestStore();

    mockedHttp.post.mockImplementation(() => new Promise(() => undefined));

    render(
      <Provider store={store}>
        <FormLogin navigateTo={jest.fn()} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu email/i), {
      target: { name: "email", value: "maria@bytebank.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Efetuar login/i }));

    const button = screen.getByRole("button", { name: /Efetuando login/i });

    expect(button).toBeDisabled();
    expect(screen.getByTestId("button-loading-spinner")).toBeInTheDocument();
  });
});
