import authReducer from "./auth/auth.slice";
import userReducer from "./user/user.slice";
import cartReducer from "./cart/cart.slice";
import socketReducer from "./socket/socket.slice";
import promotionReducer from "./promotion/promotion.slice";
import orderReducer from "./order/order.slice";
import shipReducer from "./ship/ship.slice";
import reviewReducer from "./review/review.slice";

const reducer = {
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  socket: socketReducer,
  promotion: promotionReducer,
  order: orderReducer,
  ship: shipReducer,
  review: reviewReducer,
};

export default reducer;
