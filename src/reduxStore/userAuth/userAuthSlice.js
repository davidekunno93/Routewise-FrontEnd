import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false,
    uid: null,
    username: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    inFirebase: false,
    inDatabase: false,
};


const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
        updateFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        updateLastName: (state, action) => {
            state.lastName = action.payload;
        },
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const { updateEmail, updatePassword, updateFirstName, updateLastName, updateUsername } = userAuthSlice.actions;
// userAuthReducer is made to be the default export since we used .reducer on the createSlice variable
export default userAuthSlice.reducer;