import { useAppSelector } from "@/hooks/redux.hooks";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  userData: IRedisDBUser | null;
  // userProfileData: IGetUserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUser = {
  userData: null,
  // userProfileData: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IRedisDBUser>) => {
      state.userData = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<IRedisDBUser>>) => {
      if (state.userData) {
        state.userData = {
          ...state.userData,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.userData = null;
    },
    // setUserProfile: (state, action: PayloadAction<IGetUserProfile>) => {
    //   state.userProfileData = action.payload;
    // },
    // clearUserProfile: (state) => {
    //   state.userProfileData = null;
    // },
  },
});

export const useUser = () =>
  useAppSelector((state: RootState) => state.user?.userData);

export const {
  setUser,
  updateUser,
  clearUser,
  // setUserProfile,
  // clearUserProfile,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
