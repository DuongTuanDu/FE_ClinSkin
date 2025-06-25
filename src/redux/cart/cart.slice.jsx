import { createSlice } from "@reduxjs/toolkit";
import { get, set } from "@storage/storage";

const initialState = {
  cart: get("cart") || {
    products: [],
    totalAmount: 0,
  },
};

const calculateTotalAmount = (products) => {
  return products.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const findExistingItemIndex = (products, newItem) => {
  return products.findIndex((item) => {
    const idMatch = item.productId === newItem.productId;
    return idMatch;
  });
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = findExistingItemIndex(
        state.cart.products,
        newItem
      );

      if (existingItemIndex !== -1) {
        state.cart.products[existingItemIndex].quantity += 1;
      } else {
        state.cart.products.push({
          productId: newItem.productId,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          brand: newItem.brand,
          quantity: 1,
        });
      }
      state.cart.totalAmount = calculateTotalAmount(state.cart.products);
      set("cart", state.cart);
    },
  },
});

export const {
  addToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
