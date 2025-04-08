import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  userInfo: {
    _id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
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
  };
}

const initialState: IUser = {
  userInfo: {
    _id: null,
    firstName: null,
    lastName: null,
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
  },
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser["userInfo"]>) => {
            state.userInfo = action.payload;
        },
        clearUser: (state) => {
            state.userInfo._id = null;
            state.userInfo.firstName = null;
            state.userInfo.lastName = null;
            state.userInfo.email = null;
            state.userInfo.channelName = null;
            state.userInfo.bio = null;
            state.userInfo.avatar = null;
            state.userInfo.banner = null;
            state.userInfo.watchHistory = [];
            state.userInfo.phoneNumber = null;
            state.userInfo.isVerified = null;
            state.userInfo.accountStatus = null;
            state.userInfo.country = null;
        },
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;