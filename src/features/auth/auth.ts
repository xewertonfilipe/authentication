import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import http from "../../http";
import type {
  AuthErrorResponse,
  AuthTokenResponse,
  LoginCredentials,
} from "../../interfaces";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  credentials: LoginCredentials;
  status: AuthStatus;
  error: string;
}

interface AuthSliceState {
  auth: AuthState;
}

const initialCredentials: LoginCredentials = {
  email: "",
  password: "",
};

const initialState: AuthState = {
  credentials: initialCredentials,
  status: "idle",
  error: "",
};

export const clearStoredToken = () => {
  sessionStorage.removeItem("token");
};

export const fetchAndStoreToken = (token: string) => {
  sessionStorage.setItem("token", token);
};

export const loginUser = createAsyncThunk<
  AuthTokenResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", (credentials, { rejectWithValue }) => {
  return http
    .post<AuthTokenResponse>("/auth/token", credentials)
    .then((response) => {
      fetchAndStoreToken(response.data.accessToken);
      return response.data;
    })
    .catch((error: AxiosError<AuthErrorResponse>) => {
      if (error?.response?.status === 401) {
        return rejectWithValue("Dados invalidos. Verifique e tente novamente.");
      }

      return rejectWithValue(
        "Nao foi possivel realizar o login. Tente novamente em instantes."
      );
    });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentialField: (
      state,
      action: {
        payload: {
          field: keyof LoginCredentials;
          value: string;
        };
      }
    ) => {
      state.credentials[action.payload.field] = action.payload.value;
    },
    clearAuthError: (state) => {
      state.error = "";
    },
    resetAuthState: (state) => {
      state.credentials = initialCredentials;
      state.status = "idle";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ??
          "Nao foi possivel realizar o login. Tente novamente em instantes.";
      });
  },
});

export const selectCredentials = (state: AuthSliceState) =>
  state.auth.credentials;
export const selectAuthStatus = (state: AuthSliceState) => state.auth.status;
export const selectAuthError = (state: AuthSliceState) => state.auth.error;

export const { clearAuthError, resetAuthState, setCredentialField } =
  authSlice.actions;

export default authSlice.reducer;
