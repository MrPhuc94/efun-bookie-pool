import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./reducers/appSlice";
import { serviceSlice } from "./reducers/serviceSlice";
import { userSlice } from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    service: serviceSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
