import { createSlice } from "@reduxjs/toolkit";

export const initialState = () => ({
  currentAddress: null,
  supportTokenAndBalance: [],
  isLoadingWallet: false,
  tokens: null,
});

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    changeCurrentAddress(state, action) {
      console.log("currentAddress", action);
      state.currentAddress = action.payload;
    },

    changeListToken(state, action) {
      console.log("tokensList", action);
      state.tokens = action.payload;
    },

    changeSupportTokenAndBalance(state, action) {
      const tokenSupport = action.payload.filter(
        (item) => item.symbol === "EFUN"
      );
      state.supportTokenAndBalance = tokenSupport;
    },
    changeLoadingWallet(state, action) {
      state.isLoadingWallet = action.payload;
    },
  },
});

export const {
  changeCurrentAddress,
  changeSupportTokenAndBalance,
  changeLoadingWallet,
  changeListToken,
} = walletSlice.actions;

export default walletSlice.reducer;
