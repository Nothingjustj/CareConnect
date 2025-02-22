import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import hospitalReducer from "./hospitalSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        hospital: hospitalReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
