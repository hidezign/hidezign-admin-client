import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ----------------------------------------------------
   Types
---------------------------------------------------- */

export interface User {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any; // in case your API sends dynamic fields
}

export interface AuthState {
  token: string | null;
  role: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  token: string;
  role: string;
  user: User;
}

/* ----------------------------------------------------
   Initial State
---------------------------------------------------- */

const initialState: AuthState = {
  token: null,
  role: null,
  user: null,
  isAuthenticated: false,
};

/* ----------------------------------------------------
   Slice
---------------------------------------------------- */

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

/* ----------------------------------------------------
   Exports
---------------------------------------------------- */

export const { loginSuccess, logout } = authReducer.actions;
export default authReducer.reducer;
