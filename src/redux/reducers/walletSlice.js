import { createSlice } from "@reduxjs/toolkit";

export const initialState = () => ({
  currentAddress: null,
  supportTokenAndBalance: [],
  isLoadingWallet: false,
});

export const walletSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeCurrentAddress(state, action) {
      console.log("phuctnAddress", action);
      state.currentAddress = action.payload;
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
} = walletSlice.actions;

export default walletSlice.reducer;
