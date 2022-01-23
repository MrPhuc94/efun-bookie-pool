import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  yourPredict: null,
  yourClaimed: [],
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    changeYourPredict(state, action) {
      state.yourPredict = action.payload;
    },
    changeYourClaimed(state, action) {
      let yourClaimed = state.yourClaimed.push(action.payload);
      state.yourClaimed = yourClaimed;
    },
    resetMatchesSlice(state, action) {
      state = initialState;
    },
  },
});

export const { changeYourPredict, resetMatchesSlice, changeYourClaimed } =
  matchesSlice.actions;

export default matchesSlice.reducer;
