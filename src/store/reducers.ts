import userReducer from "@/store/features/user/userSlice";

export const rootReducers = {
  user: userReducer,
};

export type RootReducers = typeof rootReducers;