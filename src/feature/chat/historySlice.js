import { createSlice } from "@reduxjs/toolkit";

const loadChats = () => {
  const data = localStorage.getItem("historyMessages");
  return data ? JSON.parse(data) : [];
};

const saveChats = (chats) => {
  localStorage.setItem("historyMessages", JSON.stringify(chats));
};

const historySlice = createSlice({
  name: "history",
  initialState: {
    chats: loadChats(),
    selectedChatIndex: null,
  },
  reducers: {
    addNewChat: (state) => {
      state.chats.push({
        messages: [],
        createdAt: new Date().toISOString(),
      });
      state.selectedChatIndex = state.chats.length - 1;
      saveChats(state.chats);
    },
    addMessageToChat: (state, action) => {
      const { sender, text } = action.payload;
      if (
        state.selectedChatIndex !== null &&
        state.chats[state.selectedChatIndex]
      ) {
        state.chats[state.selectedChatIndex].messages.push({
          sender,
          text,
          id: Math.random(99999999999),
        });
        saveChats(state.chats);
      }
    },
    selectChat: (state, action) => {
      state.selectedChatIndex = action.payload;
    },
    deleteChatByIndex: (state, { payload: i }) => {
      if (i < 0 || i >= state.chats.length) return;
      state.chats.splice(i, 1);
      state.selectedChatIndex =
        state.selectedChatIndex === i
          ? null
          : state.selectedChatIndex > i
            ? state.selectedChatIndex - 1
            : state.selectedChatIndex;
      saveChats(state.chats);
    },
    editMessageInChat: (state, action) => {
      const { chatIndex, messageIndex, newText } = action.payload;
      if (
        state.chats[chatIndex] &&
        state.chats[chatIndex].messages[messageIndex] &&
        state.chats[chatIndex].messages[messageIndex].sender === "user"
      ) {
        state.chats[chatIndex].messages[messageIndex].text = newText;
        saveChats(state.chats);
      }
    },
    deleteMessageById: (state, action) => {
      const { chatIndex, messageId } = action.payload;
      if (!state.chats[chatIndex]) return;
      state.chats[chatIndex].messages = state.chats[chatIndex].messages.filter(
        (msg) => msg.id !== messageId
      );
      saveChats(state.chats);
    },
  },
});

export const {
  addNewChat,
  addMessageToChat,
  selectChat,
  deleteChatByIndex,
  editMessageInChat,
  deleteMessageById,
} = historySlice.actions;

export default historySlice.reducer;

