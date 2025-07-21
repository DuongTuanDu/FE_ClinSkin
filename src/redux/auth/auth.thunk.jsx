import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

// login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/auth/login", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/auth/register", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// send otp
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/auth/send-otp", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// verify otp
export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/auth/verify-otp", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/auth/reset-password", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// get account
export const getAccountUser = createAsyncThunk(
  "auth/getAccountUser",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/auth/account");
    } catch (error) {
      remove("ACCESS_TOKEN");
      remove("cart");
      return rejectWithValue(error.response.data);
    }
  }
);
 
// Admin
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/auth/login", data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin
export const getAccountAdmin = createAsyncThunk(
  "auth/getAccountAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/admin/auth/account");
    } catch (error) {
      remove("ACCESS_TOKEN_ADMIN");
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin
export const updateAccountAdmin = createAsyncThunk(
  "auth/updateAccountAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await axios.put(`/admin/admin-accounts/${id}`, data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin
export const getAllAccountAdmin = createAsyncThunk(
  "auth/getAllAccountAdmin",
  async (
    { page = 1, pageSize = 10, search = "", role = "" },
    { rejectWithValue }
  ) => {
    try {
      return await axios.get(
        `/admin/admin-accounts?page=${page}&pageSize=${pageSize}&search=${search}&role=${role}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin
export const createAccountAdmin = createAsyncThunk(
  "auth/createAccountAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/admin-accounts", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin
export const removeAccountAdmin = createAsyncThunk(
  "auth/removeAccountAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/admin-accounts/${payload}`);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);