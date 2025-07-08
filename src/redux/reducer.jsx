import authReducer from "./auth/auth.slice";
import userReducer from "./user/user.slice";
import cartReducer from "./cart/cart.slice";
import socketReducer from "./socket/socket.slice";
import promotionReducer from "./promotion/promotion.slice";

const reducer = {
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  socket: socketReducer,
  promotion: promotionReducer,
};

export default reducer;
