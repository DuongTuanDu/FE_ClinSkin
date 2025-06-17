import authReducer from "./auth/auth.slice";
import userReducer from "./user/user.slice";

const reducer = {
  auth: authReducer,
  user: userReducer,
};

export default reducer;
