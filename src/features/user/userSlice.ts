import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  avatar?: string | null;
  banner?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  isVerified?: boolean | null;
  accountStatus?: string | null;
  bio?: string | null;
  watchHistory?: string[];
  channelName?: string | null;
}

const initialState: IUser = {
  _id: null,
  firstName: null,
  lastName: null,
  userName: null,
  email: null,
  avatar: null,
  banner: null,
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
    setUser: (state, action: PayloadAction<IUser>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
