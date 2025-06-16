import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const getUserList = createAsyncThunk(
  "user/getUserList",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/admin/users?page=${payload.page}&pageSize=${payload.pageSize}&search=${payload.search || ""}&status=${payload.status || ""}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await axios.put(
        `/admin/users/${id}`, payload
      );
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      return await axios.delete(
        `/admin/users/${id}`
      );
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
