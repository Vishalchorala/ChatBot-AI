import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaHistory, FaPlus } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { SiLivechat } from "react-icons/si";
import { selectChat, deleteChatByIndex, addNewChat } from "../feature/chat/historySlice";
import { PiDotsThreeVertical } from "react-icons/pi";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import UserProfilePreview from "./UserProfilePreview";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../constant/paths";

const ChatHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const chats = useSelector((state) => state.history.chats);
  const selectedChatIndex = useSelector(
    (state) => state.history.selectedChatIndex
  );

  const reversedChats = [...chats].slice().reverse();

  const originalIndexFromReversed = (revIndex) => chats.length - 1 - revIndex;

  const handleSelectChat = (index) => {
    dispatch(selectChat(index));
    setMenuOpenIndex(null);
  };

  const handleDeleteChat = (index) => {
    toast.success("Chat Deleted Succesfully...");
    dispatch(deleteChatByIndex(index));
    setMenuOpenIndex(null);
  };


  const profileFun = () => {
    navigate(paths.profile)
  }

  return (
    <>
      <div className="md:hidden flex justify-between w-full items-center p-2.5 bg-purple-50 ">
        <div className="flex w-full justify-between items-center">
          <button
            onClick={() => {
              dispatch(addNewChat());
              toast.success("New chat started!");
            }}
            className="px-2 py-2 rounded-full text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-pink-600 transition cursor-pointer hover:brightness-110 active:scale-95"
          >
            <FaPlus />
          </button>
          <h1 className="text-xl font-bold italic text-purple-700 drop-shadow-sm">
            <SiLivechat className="inline w-5 h-5 mr-0.5 mb-0.5" />
            ChatBot
          </h1>

          <div className="flex items-center space-x-2.5">
            <CgProfile className="cursor-pointer size-5 text-purple-600" onClick={profileFun} />
            {!isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="text-xl text-purple-700 transition-transform hover:scale-110"
                aria-label="Open chat history"
              >
                <FiMenu />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`
          fixed top-0 left-0 h-full w-full sm:w-1/3 z-50 bg-transparent p-3 sm:p-4 
          transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block md:top-auto md:left-auto md:h-auto  
        `}
      >
        <div className="p-4 w-full h-full rounded-xl bg-white text-black border border-purple-200 relative flex flex-col">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-2xl text-purple-700 transition-transform hover:scale-110 sm:hidden pointer-events-auto z-50 "
            aria-label="Close chat history"
          >
            <FiX />
          </button>

          <h1 className="text-xl sm:text-xl font-bold italic text-purple-700 mb-4 drop-shadow-sm">
            <FaHistory className="inline mb-1 w-5 h-5 mr-0.5" /> History
          </h1>

          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {chats.length === 0 ? (
              <p className="text-md h-full italic text-gray-700 bg-purple-50 p-3 rounded-xl shadow-inner">
                No history... yet!
              </p>
            ) : (
              <ul>
                {reversedChats.map((chat, revIndex) => {
                  const index = originalIndexFromReversed(revIndex);

                  return (
                    <li
                      key={index}
                      className={`p-3 mb-2 relative  ${index === selectedChatIndex
                        ? "bg-purple-200 font-semibold  rounded-lg "
                        : "bg-purple-50 rounded"
                        }`}
                    >
                      <div
                        onClick={() => handleSelectChat(index)}
                        className="cursor-pointer"
                      >
                        <div>
                          {chat.messages?.length
                            ? (() => {
                              const lastUserMsg = [...chat.messages]
                                .reverse()
                                .find((m) => m.sender === "user");
                              if (!lastUserMsg) return "No user message yet.";
                              const { text } = lastUserMsg;
                              return text.length > 35
                                ? text.slice(0, 35) + "..."
                                : text;
                            })()
                            : "No messages yet."}
                        </div>

                        <div>
                          <small className="text-gray-500">
                            {new Date(chat.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>

                      <div className="absolute top-3 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenIndex(
                              menuOpenIndex === index ? null : index
                            );
                          }}
                          className="text-xl text-gray-600 hover:text-purple-700 cursor-pointer"
                          aria-label="Open chat options"
                        >
                          <PiDotsThreeVertical />
                        </button>

                        {menuOpenIndex === index && (
                          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow z-10">
                            <button
                              className=" px-2 py-1 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                              onClick={() => handleDeleteChat(index)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

          </div>

          <div className="hidden md:block">
            <UserProfilePreview />
          </div>

        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40 sm:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default ChatHistory;