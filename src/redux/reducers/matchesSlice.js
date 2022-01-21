import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  yourPredict: null,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    changeYourPredict(state, action) {
      state.yourPredict = action.payload;
    },
    resetMatchesSlice(state, action) {
      state = initialState;
    },
  },
});

export const { changeYourPredict, resetMatchesSlice } = matchesSlice.actions;

export default matchesSlice.reducer;
