import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
};

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
  },
});

export const { setServices } = serviceSlice.actions;

export default serviceSlice.reducer;
