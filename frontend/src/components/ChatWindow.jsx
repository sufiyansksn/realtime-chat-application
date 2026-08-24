import "./ChatWindow.css";
import { useState, useEffect, useRef } from "react";

const chatMessages = {
    Ahmed: [
        {
            id: 1,
            type: "received",
            content: "Hey Sufiyan! 👋",
            time: "10:30",
        },
        {
            id: 2,
            type: "sent",
            content: "Hey Ahmed! How are you?",
            time: "10:31",
        },
        {
            id: 3,
            type: "received",
            content: "I'm doing great! How about you?",
            time: "10:32",
        },
        {
            id: 4,
            type: "sent",
            content: "I'm good too 😊",
            time: "10:33",
        },
    ],

    Family: [
        {
            id: 5,
            type: "received",
            content: "Good morning everyone! ☀️",
            time: "09:15",
        },
        {
        id: 6,
        type: "sent",
        content: "Good morning!",
        time: "09:17",
        },
        {
        id: 7,
        type: "received",
        content: "What are you doing today?",
        time: "09:20",
        },
    ],

    "Work Group": [
        {
            id: 8,
            type: "received",
            content: "Meeting at 5 PM.",
            time: "08:45",
        },
        {
        id: 9,
        type: "sent",
        content: "Okay, I'll be there.",
        time: "08:47",
        },
    ],
};

function ChatWindow({ selectedChat }){
    
    const [messageText, setMessageText] = useState("");

    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    },[messages])

    useEffect(() => {
        setMessages(chatMessages[selectedChat] || []);
    }, [selectedChat]);



    const handleSend = () => {
        if (!messageText.trim()) {
            return;
        }
        const newMessage = {
            id: Date.now(),
            type: "sent",
            content: messageText,
            time: "Now"
        };
        setMessages([...messages, newMessage])

        setMessageText("");
    }

    return (
        <div className="chat-window-content">

            {/* Header */}
            <header className="chat-header">

                <div className="chat-user">
                    <div className="chat-user-avatar">A</div>
                    <div>
                        <h3>{selectedChat}</h3>
                        <span>Online</span>
                    </div>
                </div>

                <div className="chat-actions">
                    <button>📞</button>
                    <button>🎥</button>
                    <button>⋮</button>
                </div>

            </header>

            {/* Messages */}
            <div className="message-list">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.type}`}
                    >
                        <p>{message.content}</p>
                        <span>{message.time}</span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>

            </div>

            {/* Message Input */}
            <div className="message-input-container">

                <button className="input-action">😊</button>

                <button className="input-action">📎</button>

                <input
                    type="text"
                    placeholder="Type a message..."
                    value = {messageText}
                    onChange = {(event) => setMessageText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSend();
                        }
                    }}
                />

                <button 
                    className="send-button"
                    onClick = {handleSend}
                >➤</button>

            </div>
        </div>
    );
}

export default ChatWindow;