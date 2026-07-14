import { loginUser } from "../features/auth/auth";

const getFreshStore = async () => {
  jest.resetModules();
  const module = await import(".");
  return module.default;
};

describe("store", () => {
  it("starts with expected initial state", async () => {
    const store = await getFreshStore();
    const state = store.getState();

    expect(Object.keys(state)).toEqual(["auth"]);
    expect(state.auth.credentials).toEqual({ email: "", password: "" });
    expect(state.auth.status).toBe("idle");
    expect(state.auth.error).toBe("");
  });

  it("updates auth state for pending, fulfilled and rejected", async () => {
    const store = await getFreshStore();

    store.dispatch(
      loginUser.pending("req-1", {
        email: "maria@bytebank.com",
        password: "123456",
      })
    );
    expect(store.getState().auth.status).toBe("loading");
    expect(store.getState().auth.error).toBe("");

    store.dispatch(
      loginUser.fulfilled({ accessToken: "token-123" }, "req-1", {
        email: "maria@bytebank.com",
        password: "123456",
      })
    );
    expect(store.getState().auth.status).toBe("succeeded");

    store.dispatch(
      loginUser.rejected(
        new Error("network"),
        "req-2",
        { email: "", password: "" },
        "Nao foi possivel realizar o login. Tente novamente em instantes."
      )
    );
    expect(store.getState().auth.status).toBe("failed");
    expect(store.getState().auth.error).toBe(
      "Nao foi possivel realizar o login. Tente novamente em instantes."
    );
  });
});
