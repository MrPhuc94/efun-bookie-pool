import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./reducers/appSlice";
import { matchesSlice } from "./reducers/matchesSlice";
import { serviceSlice } from "./reducers/serviceSlice";
import { userSlice } from "./reducers/userSlice";
import { walletSlice } from "./reducers/walletSlice";

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    service: serviceSlice.reducer,
    user: userSlice.reducer,
    wallet: walletSlice.reducer,
    matches: matchesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
