import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IAuthState{
    isAuthenticated: string,
}

const initialState: IAuthState = {
    isAuthenticated: "unauthenticated",
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = action.payload
        },
    }
})

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;