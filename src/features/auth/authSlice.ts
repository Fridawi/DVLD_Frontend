import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthResponse } from "../../types/auth";

interface AuthState {
  user: {
    id: number | null;
    name: string | null;
    role: string | null;
  };
  token: string | null;
  isAuthenticated: boolean;
}

const getSavedUser = () => {
  const savedUser = localStorage.getItem("user_info");
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      return { id: null, name: null, role: null };
    }
  }
  return { id: null, name: null, role: null };
};

const initialState: AuthState = {
  user: getSavedUser(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { userName, token, userID, role } = action.payload;

      state.user = { id: userID, name: userName, role: role };
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("user_info", JSON.stringify(state.user));
    },
    logOut: (state) => {
      state.user = { id: null, name: null, role: null };
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user_info");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
