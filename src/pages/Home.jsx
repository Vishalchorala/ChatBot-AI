import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../constant/paths";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const [typedText, setTypedText] = useState("");
    const fullText = "Introducing ChatBot...";

    useEffect(() => {
        let currentIndex = 0;
        let interval;

        const startTyping = () => {
            interval = setInterval(() => {
                setTypedText(fullText.slice(0, currentIndex + 1));
                currentIndex++;

                if (currentIndex === fullText.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setTypedText("");
                        currentIndex = 0;
                        startTyping();
                    }, 1500);
                }
            }, 100);
        };

        startTyping();
        return () => clearInterval(interval);
    }, []);

    const handleStart = () => {
        navigate(paths.logIn);
    };

    return (
        <motion.div
            className="w-screen h-dvh bg-black text-white flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.h1
                className="text-3xl sm:text-5xl font-bold mb-6"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                {typedText}
            </motion.h1>

            <motion.p
                className="text-md md:text-lg max-w-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                ChatBot is your personal AI assistant that helps you get instant answers,
                learn new things, and have fun conversations. Click below to get started.
            </motion.p>

            <motion.button
                onClick={handleStart}
                className="bg-white text-black px-6 font-serif py-2 sm:py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition duration-300 cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                Try ChatBot
                <motion.span
                    className="inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    <ArrowRight size={18} />
                </motion.span>
            </motion.button>
        </motion.div>
    );
};

export default Home;
