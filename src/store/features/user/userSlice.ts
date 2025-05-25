import { useAppSelector } from "@/hooks/redux.hooks";
import { IGetUserProfile } from "@/interfaces/IGetUserProfile";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
    userData: IRedisDBUser | null;
    userProfileData: IGetUserProfile | null;
}

const initialState: IUser = {
    userData: null,
    userProfileData: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IRedisDBUser>) => {
            state.userData = action.payload;
        },
        updateUser: (state, action: PayloadAction<Partial<IRedisDBUser>>) => {
            if(state.userData){
                state.userData = {
                    ...state.userData,
                    ...action.payload
                }
            }
        },
        clearUser: (state) => {
            state.userData = null;
        },
        setUserProfile: (state, action: PayloadAction<IGetUserProfile>) => {
            state.userProfileData = action.payload;
        },
        clearUserProfile: (state) => {
            state.userProfileData = null;
        },
    }
})

export const useUser = () => useAppSelector((state: RootState) => state.user?.userData);

export const { setUser, updateUser, clearUser, setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;