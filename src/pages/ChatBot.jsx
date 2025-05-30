import React from 'react';
import { Toaster } from 'react-hot-toast';
import ChatHistory from '../Components/ChatHistory';
import ChatDialog from '../Components/ChatDialog';

const ChatBot = () => {
    return (
        <>
            <div className="flex flex-col md:flex-row h-dvh bg-purple-100">
                <ChatHistory />
                <ChatDialog />
            </div>
        </>
    );
};

export default ChatBot;
