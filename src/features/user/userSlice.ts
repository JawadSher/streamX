import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IRedisDBUser = {
  _id: null,
  firstName: null,
  lastName: null,
  userName: null,
  email: null,
  avatarURL: null,
  bannerURL: null,
  phoneNumber: null,
  country: null,
  isVerified: false,
  accountStatus: null,
  bio: null,
  watchHistory: [],
  channelName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IRedisDBUser>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
