import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "@axios/axios";

// create
export const orderCod = createAsyncThunk(
  "order/orderCod",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/orders/cod", payload);
      return res;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// update
export const updateStatusOrderByAdmin = createAsyncThunk(
  "order/updateStatusOrderByAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await axios.put(
        `/admin/orders/status/${id}`, data
      );
    } catch (error) {
      message.warning(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
// delete
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      return await axios.delete(
        `/admin/orders/${id}`
      );
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);