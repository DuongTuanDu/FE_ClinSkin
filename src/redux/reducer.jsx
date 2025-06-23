import authReducer from "./auth/auth.slice";
import userReducer from "./user/user.slice";
import cartReducer from "./cart/cart.slice";

const reducer = {
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
};

export default reducer;
