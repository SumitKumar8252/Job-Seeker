import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost, getErrorMessage } from "../../shared/api/client";

const initialState = {
  user: null,
  bootstrapStatus: "idle",
  authStatus: "idle",
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGet("/auth/me");
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Session not found"));
    }
  },
  {
    condition: (_, { getState }) => getState().auth.bootstrapStatus === "idle",
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiPost("/auth/login", credentials);
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to sign in"));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await apiPost("/auth/register", payload);
      const loginAction = await dispatch(
        loginUser({
          email: payload.email,
          password: payload.password,
        })
      );

      if (loginUser.fulfilled.match(loginAction)) {
        return loginAction.payload;
      }

      return rejectWithValue(
        loginAction.payload || "Registration worked, but automatic login failed."
      );
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to register"));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await apiPost("/auth/logout");
  } catch {
    // Local reset is still safe even when the session cookie is already gone.
  }

  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.bootstrapStatus = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.bootstrapStatus = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.bootstrapStatus = "succeeded";
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.bootstrapStatus = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error = action.payload || "Unable to sign in";
      })
      .addCase(registerUser.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.bootstrapStatus = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error = action.payload || "Unable to register";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authStatus = "idle";
        state.user = null;
        state.error = null;
        state.bootstrapStatus = "succeeded";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.authStatus;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthReady = (state) => state.auth.bootstrapStatus === "succeeded";
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;
