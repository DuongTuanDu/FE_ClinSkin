import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "@axios/axios";


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