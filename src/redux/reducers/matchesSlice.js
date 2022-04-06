import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  yourPredict: null,
  yourClaimed: [],
  listPredicted: [],
  yourContributed: 0,
  yourContributedPending: 0,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    changeYourContributedPending(state, action) {
      state.yourContributedPending = action.payload;
    },
    changeYourContributed(state, action) {
      state.yourContributed = action.payload;
    },
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
    changeListPredicted(state, action) {
      state.listPredicted = action.payload;
    },
  },
});

export const {
  changeYourPredict,
  resetMatchesSlice,
  changeYourClaimed,
  changeListPredicted,
  changeYourContributed,
  changeYourContributedPending
} = matchesSlice.actions;

export default matchesSlice.reducer;
