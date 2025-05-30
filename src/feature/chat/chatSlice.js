import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadChats = () => {
  const data = localStorage.getItem("chatMessages");
  return data ? JSON.parse(data) : [];
};

const saveChats = (chats) => {
  localStorage.setItem("chatMessages", JSON.stringify(chats));
};

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const sendMessageToGemini = createAsyncThunk(
  "chat/sendMessageToGemini",
  async (userMessage, { rejectWithValue }) => {
    try {
      const res = await axios.post(URL, {
        contents: [{ parts: [{ text: userMessage }] }],
      });

      return {
        bot:
          res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: loadChats(),
    selectedChatId: null,
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      const newMessage = {
        id: Date.now(),
        type: "user",
        text: action.payload,
      };
      state.messages.push(newMessage);
      saveChats(state.messages);
    },
    editMessage: (state, action) => {
      const { id, newText } = action.payload;
      const message = state.messages.find((msg) => msg.id === id);
      console.log("message", state.messages);

      if (message) {
        message.text = newText;
        saveChats(state.messages);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      saveChats(state.messages);
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToGemini.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToGemini.fulfilled, (state, action) => {
        state.loading = false;
        const newBotMessage = {
          id: Date.now(),
          type: "bot",
          text: action.payload.bot,
        };
        state.messages.push(newBotMessage);
        saveChats(state.messages);
      })
      .addCase(sendMessageToGemini.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addUserMessage, editMessage, clearMessages, setSelectedChatId } =
  chatSlice.actions;
export default chatSlice.reducer;
