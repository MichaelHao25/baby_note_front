import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  school_id: string | null;
  userInfo: {
    id: number;
    username: string;
    nickname: string;
    mobile: string;
    avatar: string;
    score: number;
    user_id: number;
    createtime: number;
    expiretime: number;
    expires_in: number;
  } | null;
  auth: string[];
  isInitialized: boolean;
}

const getUserInfoFromStorage = (): UserState["userInfo"] => {
  try {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    return null;
  }
};

const getAuthFromStorage = (): string[] => {
  try {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : [];
  } catch (error) {
    console.error("Failed to parse auth from localStorage:", error);
    return [];
  }
};

const initialState: UserState = {
  token: localStorage.getItem("token"),
  school_id: localStorage.getItem("school_id"),
  userInfo: getUserInfoFromStorage(),
  auth: getAuthFromStorage(),
  isInitialized: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setSchoolId: (state, action: PayloadAction<string>) => {
      state.school_id = action.payload;
      localStorage.setItem("school_id", action.payload);
    },
    setUserInfo: (state, action: PayloadAction<UserState["userInfo"]>) => {
      state.userInfo = action.payload;
      if (action.payload) {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userInfo");
      }
    },
    setAuth: (state, action: PayloadAction<string[]>) => {
      state.auth = action.payload;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    clearUser: (state) => {
      state.token = null;
      state.school_id = null;
      state.userInfo = null;
      state.auth = [];
      state.isInitialized = false;
      localStorage.removeItem("token");
      localStorage.removeItem("school_id");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("auth");
    },
  },
});

export const {
  setToken,
  setSchoolId,
  setUserInfo,
  setAuth,
  setInitialized,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;
