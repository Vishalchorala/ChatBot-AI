import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    avatarUrl: "https://avatar.iran.liara.run/public/48",
};

const avatarSlice = createSlice({
    name: "avatar",
    initialState,
    reducers: {
        setAvatarUrl: (state, action) => {
            state.avatarUrl = action.payload;
        },
        resetAvatarUrl: (state) => {
            state.avatarUrl = initialState.avatarUrl;
        },
    },
});

export const { setAvatarUrl, resetAvatarUrl } = avatarSlice.actions;

export default avatarSlice.reducer;
