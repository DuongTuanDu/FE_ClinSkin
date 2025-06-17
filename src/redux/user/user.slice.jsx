import { createSlice } from "@reduxjs/toolkit";
import { getUserList } from "./user.thunk";

const initialState = {
  users: [],
  isLoading: false,
  error: {},
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPage: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      //Get user list admin
      .addCase(getUserList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
