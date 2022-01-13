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
    resetServiceSlice: (state, action) => {
      return (state = initialState);
    },
  },
});

export const { setServices, resetServiceSlice } = serviceSlice.actions;

export default serviceSlice.reducer;
