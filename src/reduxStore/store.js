import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuth/userAuthSlice";

export const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
    },
});
