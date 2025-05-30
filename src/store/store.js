import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "../feature/chat/chatSlice";
import historySlice from "../feature/chat/historySlice";
import avatarSlice from "../feature/chat/avatarSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    history: historySlice,
    avatar: avatarSlice,
  },
});

