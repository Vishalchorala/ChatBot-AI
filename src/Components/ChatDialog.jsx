import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SiLivechat } from "react-icons/si";
import { sendMessageToGemini } from "../feature/chat/chatSlice";
import {
  addNewChat,
  addMessageToChat,
  selectChat,
  editMessageInChat,
  deleteMessageById,
} from "../feature/chat/historySlice";
import ReactMarkDown from "react-markdown";
import toast from "react-hot-toast";
import "../dialog.css";
import TypingText from "./TypingText";
import { FiArrowDown, FiCheck, FiCopy } from "react-icons/fi";
import { RiEditFill } from "react-icons/ri";
import { TbCopy } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";
import { Link } from "react-router-dom";
import { paths } from "../constant/paths";

const ChatDialog = () => {
  const [input, setInput] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [animatedMessages, setAnimatedMessages] = useState(new Set());

  const dispatch = useDispatch();

  const { chats, selectedChatIndex } = useSelector((state) => state.history);
  const { loading, error } = useSelector((state) => state.chat);

  const messagesEndRef = useRef(null);
  const lastBotMessageRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const atBottomRef = useRef(true);

  useEffect(() => {
    if (selectedChatIndex === null && chats.length > 0) {
      dispatch(selectChat(chats.length - 1));
    }
  }, [chats, selectedChatIndex, dispatch]);

  useEffect(() => {
    if (atBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, selectedChatIndex, loading]);

  const currentChat =
    selectedChatIndex !== null && chats[selectedChatIndex]
      ? chats[selectedChatIndex]
      : { messages: [] };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    e.target.style.height = "auto";

    if (!loading && value.trim() !== "") {
      e.target.style.height = e.target.scrollHeight + "px";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = input.trim();

    if (!userMessage) {
      toast.error("You forgot to type! Type first, send later.");
      return;
    }

    if (chats.length === 0) {
      dispatch(addNewChat([]));
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setAnimatedMessages(new Set());

    dispatch(addMessageToChat({ sender: "user", text: userMessage }));
    setInput("");
    setIsTypingDone(false);

    dispatch(sendMessageToGemini(userMessage))
      .then((response) => {
        if (response.payload) {
          const botMessage = response.payload.bot;
          lastBotMessageRef.current = botMessage;
          dispatch(
            addMessageToChat({ sender: "bot", text: response.payload.bot })
          );
        } else {
          toast.error("No response received from Gemini.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to get response from Gemini.");
      })
      .finally(() => {
        setIsTypingDone(true); // Make sure input is re-enabled
      });
  };

  const lastChat = chats[chats.length - 1];
  const isNewChatDisabled = lastChat && lastChat.messages.length === 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
    atBottomRef.current = isAtBottom;
    setShowScrollArrow(!isAtBottom);
  };

  const startEditing = (index, currentText) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (editText.trim() === "") {
      toast.error("Message can't be empty!");
      return;
    }

    dispatch(
      editMessageInChat({
        chatIndex: selectedChatIndex,
        messageIndex: editingIndex,
        newText: editText.trim(),
      })
    );

    // const nextMessage = currentChat.messages[editingIndex + 1];

    // if (nextMessage?.sender === "bot") {
    //   dispatch(
    //     deleteMessageById({
    //       chatIndex: selectedChatIndex,
    //       messageId: nextMessage?.id,
    //     })
    //   );
    // }

    const messagesToDelete = currentChat.messages.slice(editingIndex + 1);

    messagesToDelete.forEach((msg) => {
      dispatch(
        deleteMessageById({
          chatIndex: selectedChatIndex,
          messageId: msg.id,
        })
      );
    });

    setIsTypingDone(false);
    setAnimatedMessages(new Set());

    dispatch(sendMessageToGemini(editText.trim())).then((response) => {
      if (response.payload) {
        const botMessage = response.payload.bot;
        lastBotMessageRef.current = botMessage;
        dispatch(
          addMessageToChat({
            sender: "bot",
            text: response.payload.bot,
          })
        );
      } else {
        toast.error("No response received from Gemini.");
      }
      setIsTypingDone(true);
    });

    setEditingIndex(null);
    setEditText("");
  };

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="w-full h-full md:w-2/2 p-2.5 md:p-4 bg-transparent scrollbar-hidden overflow-y-auto">
      <div className="relative h-full flex-1 px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded-xl bg-white text-black border border-purple-200 flex flex-col">
        <div className="flex justify-between">
          <h1 className="hidden md:block md:text-xl font-bold italic text-purple-700 mb-3 drop-shadow-md">
            <SiLivechat className="inline w-5.5 h-5.5 mr-0.5 mb-0.5" />
            <Link className="ml-1" to={paths.home}>
              ChatBot
            </Link>
          </h1>

          <div className="hidden md:block ">
            <button
              onClick={() => {
                if (isNewChatDisabled) {
                  return;
                }
                dispatch(addNewChat());
                toast.success("New chat started!");
              }}
              disabled={isNewChatDisabled}
              className={`px-3 py-2 rounded-full text-xs text-white transition cursor-pointer hover:brightness-110 active:scale-95
               bg-gradient-to-r from-purple-500 to-pink-500
               ${isNewChatDisabled
                  ? "opacity-50 cursor-not-allowed hover:brightness-100"
                  : "hover:bg-pink-600"
                }
              `}
            >
              + New Chat
            </button>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="text-gray-700 overflow-y-auto h-full mb-4 px-3 md:px-4 scrollbar-hidden rounded-lg bg-gradient-to-b from-white via-purple-50 to-white p-4 shadow-inner"
        >
          {selectedChatIndex === null || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full text-purple-700 font-serif font-semibold ">
              <SiLivechat className="text-purple-400 text-4xl mb-2 animate-pulse" />
              <p className="text-purple-700 text-lg font-serif font-semibold">
                {selectedChatIndex === null
                  ? "No chats available"
                  : "No messages available"}
              </p>
              {selectedChatIndex === null && (
                <p className="text-purple-500 text-sm mt-1 tracking-wide">
                  Start a conversation to see messages here.
                </p>
              )}
            </div>
          ) : (
            <>
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  className={`mb-5 flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                    } `}
                >
                  <div
                    className={`group px-3 text-sm md:text-md shadow ${msg.sender === "user"
                      ? "bg-purple-500 text-white py-2 max-w-[85%] text-right rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl "
                      : "bg-purple-100 text-purple-900 max-w-[85%] text-left rounded-tl-2xl rounded-tr-2xl rounded-br-2xl "
                      }`}
                  >
                    {msg.sender === "bot" ? (
                      <div className="markdown-body relative group">
                        {isTypingDone && (
                          <div
                            className={`
                                absolute 
                                z-10 
                                top-0 right-0
                                md:top-0 md:opacity-0 md:group-hover:opacity-100 
                                md:bg-white md:px-2 md:py-0.5 md:rounded-md md:shadow
                                md:flex md:items-center md:gap-1 md:text-xs md:text-purple-700 md:hover:text-purple-900
                                flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 px-2 py-0.5 cursor-pointer

                                ${activeIndex === index
                                ? "opacity-100 bg-white px-2 py-0.5 rounded-md shadow"
                                : "opacity-0"
                              }
                                md:opacity-0 md:group-hover:opacity-100
                              `}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(msg.text);
                                setCopiedIndex(index);
                                setTimeout(() => setCopiedIndex(null), 1000);
                              }}
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              {copiedIndex === index ? (
                                <FiCheck className="text-base text-green-600 w-3 h-3" />
                              ) : (
                                <FiCopy className="text-base w-3 h-3" />
                              )}
                              <span>
                                {copiedIndex === index ? "Copied!" : "Copy"}
                              </span>
                            </button>
                          </div>
                        )}

                        {index === currentChat.messages.length - 1 &&
                          msg.text === lastBotMessageRef.current &&
                          !loading && !animatedMessages.has(msg.text) ? (
                          <TypingText
                            key={msg.text}
                            message={msg.text}
                            onDone={() => {
                              setIsTypingDone(true);
                              setAnimatedMessages((prev) => {
                                const newSet = new Set(prev);
                                newSet.add(msg.text);
                                return newSet;
                              });
                            }}
                          />
                        ) : (
                          <ReactMarkDown>{msg.text}</ReactMarkDown>
                        )}
                      </div>
                    ) : (
                      <>
                        {editingIndex === index ? (
                          <div>
                            <textarea
                              className="w-full md:w-100 p-1 resize-none text-white outline-none"
                              rows={3}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              autoFocus
                              ref={el => el && el.setSelectionRange?.(el.value.length, el.value.length)}
                            />
                            <div className="flex justify-end mt-1 gap-2">
                              <button
                                onClick={cancelEditing}
                                className="flex items-center gap-1 bg-gray-200 text-black px-3 py-1 rounded-full hover:bg-gray-300 transition cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveEdit}
                                className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full hover:opacity-85 transition cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <ReactMarkDown>{msg.text}</ReactMarkDown>
                            <div
                              className={`absolute flex gap-1 -bottom-6.5 md:-bottom-7.5 -right-2
                  opacity-0 md:group-hover:opacity-100 transition-opacity
                  ${activeIndex === index ? "opacity-100" : ""}`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(msg.text);
                                  setCopiedIndex(index);
                                  setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                                className="text-purple-500 text-sm cursor-pointer"
                                title="Copy message"
                                aria-label="Copy message"
                              >
                                {copiedIndex === index ? (
                                  <IoCheckmark className="text-green-500 text-base w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                                ) : (
                                  <TbCopy className="text-base w-3.5 h-3.5 md:w-4 md:h-4" />
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(index, msg.text);
                                }}
                                className="text-purple-500 text-sm cursor-pointer"
                                title="Edit message"
                                aria-label="Edit message"
                              >
                                <RiEditFill className="text-base w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
              {loading && (
                <div className="flex space-x-1 items-end h-5">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-purple-700 rounded-full inline-block animate-bounce"
                      style={{
                        animationDelay: ` ${i * 0.15}s`,
                        animationDuration: "1.2s",
                      }}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p>{error.message || "An error occurred."}</p>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              disabled={loading || !isTypingDone}
              onKeyDown={handleKeyDown}
              className="w-full resize-none border border-purple-300 p-2.5 md:p-3 !pr-12 rounded-l-lg rounded-r-3xl outline-none transition-all bg-purple-50 placeholder:text-purple-400 max-h-[200px] overflow-y-auto scrollbar-hidden"
              placeholder="Ask anything..."
              rows={1}
            />

            <button
              type="submit"
              disabled={loading || !isTypingDone || input.trim().length === 0}
              className="absolute bottom-[13.5px] sm:bottom-3 right-2 md:right-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 sm:p-2 rounded-full shadow hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 -rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>
        {showScrollArrow && (
          <button
            onClick={() => {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
              setShowScrollArrow(false);
            }}
            className="absolute bottom-20 sm:bottom-22 right-5.5 sm:right-6.5 font-extrabold border border-gray-300 bg-white hover:bg-gray-100 active:scale-90 text-black p-1 sm:p-2 rounded-full shadow-sm transition-all duration-300 cursor-pointer"
          >
            <FiArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatDialog;


