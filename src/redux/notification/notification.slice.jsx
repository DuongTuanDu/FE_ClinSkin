import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {},
});

export const NotificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
