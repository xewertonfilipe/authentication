import http from "../../http";
import reducer, {
  clearAuthError,
  clearStoredToken,
  fetchAndStoreToken,
  loginUser,
  resetAuthState,
  selectAuthError,
  selectAuthStatus,
  selectCredentials,
  setCredentialField,
} from "./auth";

jest.mock("../../http", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("loginUser thunk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns fulfilled action and stores token", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    mockedHttp.post.mockResolvedValue({
      data: { accessToken: "token-123" },
    });

    const action = await loginUser({
      email: "maria@bytebank.com",
      password: "123456",
    })(jest.fn(), jest.fn(), undefined);

    expect(mockedHttp.post).toHaveBeenCalledWith("/auth/token", {
      email: "maria@bytebank.com",
      password: "123456",
    });
    expect(action.type).toBe("auth/loginUser/fulfilled");
    expect(setItemSpy).toHaveBeenCalledWith("token", "token-123");
  });

  it("returns rejected action with invalid credentials message on 401", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };

    mockedHttp.post.mockRejectedValue({ response: { status: 401 } });

    const action = await loginUser({
      email: "maria@bytebank.com",
      password: "wrong",
    })(jest.fn(), jest.fn(), undefined);

    expect(action.type).toBe("auth/loginUser/rejected");
    expect(action.payload).toBe(
      "Dados invalidos. Verifique e tente novamente."
    );
  });

  it("returns rejected action with generic message on unknown error", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };

    mockedHttp.post.mockRejectedValue(new Error("network"));

    const action = await loginUser({
      email: "maria@bytebank.com",
      password: "123456",
    })(jest.fn(), jest.fn(), undefined);

    expect(action.type).toBe("auth/loginUser/rejected");
    expect(action.payload).toBe(
      "Nao foi possivel realizar o login. Tente novamente em instantes."
    );
  });
});

describe("auth reducer and selectors", () => {
  it("updates credentials, clears error and resets state", () => {
    const withEmail = reducer(
      undefined,
      setCredentialField({ field: "email", value: "maria@bytebank.com" })
    );
    const withPassword = reducer(
      withEmail,
      setCredentialField({ field: "password", value: "123456" })
    );
    const withError = reducer(
      withPassword,
      loginUser.rejected(
        new Error("network"),
        "req-1",
        { email: "", password: "" },
        "Nao foi possivel realizar o login. Tente novamente em instantes."
      )
    );
    const withoutError = reducer(withError, clearAuthError());
    const reset = reducer(withoutError, resetAuthState());

    expect(withPassword.credentials).toEqual({
      email: "maria@bytebank.com",
      password: "123456",
    });
    expect(withError.status).toBe("failed");
    expect(withoutError.error).toBe("");
    expect(reset).toMatchObject({
      credentials: { email: "", password: "" },
      status: "idle",
      error: "",
    });
  });

  it("reads selectors", () => {
    const state = {
      auth: {
        credentials: {
          email: "maria@bytebank.com",
          password: "123456",
        },
        status: "succeeded" as const,
        error: "",
      },
    };

    expect(selectCredentials(state)).toEqual({
      email: "maria@bytebank.com",
      password: "123456",
    });
    expect(selectAuthStatus(state)).toBe("succeeded");
    expect(selectAuthError(state)).toBe("");
  });
});

describe("auth token helpers", () => {
  it("clears and stores token in session storage", () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    clearStoredToken();
    fetchAndStoreToken("token-123");

    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(setItemSpy).toHaveBeenCalledWith("token", "token-123");
  });
});
