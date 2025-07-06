import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketCustomer: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketCustomer(state, action) {
      state.socketCustomer = action.payload;
    },
  },
});

export const SocketActions = socketSlice.actions;
export default socketSlice.reducer;
