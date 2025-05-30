import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function TypingText({ message, onDone = () => { } }) {
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    let intervalId;

    setDisplayedText("");
    setTypingComplete(false);

    if (message && message.length > 0) {
      intervalId = setInterval(() => {
        if (i <= message.length) {
          setDisplayedText(message.slice(0, i));
          i++;
        } else {
          clearInterval(intervalId);
          setTypingComplete(true);
          onDone?.();
        }
      }, 10);
    } else {
      setTypingComplete(true);
    }

    return () => clearInterval(intervalId);
  }, [message]);

  return (
    <div className="typing-text">
      <ReactMarkdown>
        {typingComplete ? displayedText : displayedText + "|"}
      </ReactMarkdown>
    </div>
  );
}

export default TypingText;