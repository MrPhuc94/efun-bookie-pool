import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: null,
  appConfig: {},
  language: "en",
  menuTab: 0,
};

export const userSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAppConfig: (state, action) => {
      state.appConfig = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setUser, setToken, setAppConfig, setLanguage } =
  userSlice.actions;

export default userSlice.reducer;
