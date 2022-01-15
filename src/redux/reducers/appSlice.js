import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  appPopUps: [],
  pathBackground: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    showAppLoading: (state, action) => {
      state.loading = action.payload;
    },
    showAppPopup: (state, action) => {
      const data = action.payload;
      if (data) {
        state.appPopUps.push(data);
      }
    },
    dismissAppPopup: (state, action) => {
      if (state.appPopUps && state.appPopUps.length > 0) {
        state.appPopUps.shift();
      }
    },
    setPathBackGround: (state, action) => {
      const data = action.payload;
      if (data) {
        state.pathBackground = data;
      }
    },
    resetAppSlice: (state, action) => {
      return (state = initialState);
    },
  },
});

export const {
  showAppLoading,
  showAppPopup,
  dismissAppPopup,
  resetAppSlice,
  setPathBackGround,
} = appSlice.actions;

export default appSlice.reducer;
