import "./ChatWindow.css";
import { useState, useEffect, useRef } from "react";
import { createWebSocket } from "../services/websocket";
import { getCurrentUser, getMessages } from "../services/auth";


function ChatWindow({ selectedChat, rooms }) {

    const selectedRoom = rooms.find((room) => room.id === selectedChat);

    const roomId = selectedRoom?.id;

    const otherUser = selectedRoom?.other_user;

    const displayName = 
    `${otherUser?.first_name || ""} ${otherUser?.last_name || ""}`.trim()
    || otherUser?.username || "";

    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);


    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setCurrentUser(user);
            })
            .catch((error) => {
                console.error("getCurrentUser ERROR:", error);
            });
    }, []);


    useEffect(() => {
        if (!roomId) {
            return;
        }

        getMessages(roomId)
            .then((data) => {

                const formattedMessages = data.map((message) => ({
                    id: message.id,
                    type: message.sender === currentUser?.id ? "sent" : "received",
                    content: message.content,
                    time: new Date(message.created_at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit",}),
                }));

                setMessages(formattedMessages);
            })
            .catch((error) => {
                console.error(
                    "Failed to load message history:",
                    error
                );
            });

    }, [roomId, currentUser]);


    useEffect(() => {
        if (!currentUser || !roomId) {
            return;
        }

        const socket = createWebSocket(roomId);

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Websocket Connected!");
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            const formattedMessage = {
                id: message.id,
                type: message.sender === currentUser.id ? "sent" : "received",
                content: message.content,
                time: new Date(
                    message.created_at
                ).toLocaleTimeString([], {hour: "2-digit",minute: "2-digit", }),
            };

            setMessages((previousMessages) => [
                ...previousMessages,
                formattedMessage,
            ]);
        };

        return () => {
            socket.close();
        };

    }, [roomId, currentUser]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);


    const handleSend = () => {
        if (!messageText.trim()) {
            return;
        }

        socketRef.current.send(messageText);

        setMessageText("");
    };


    return (
        <div className="chat-window-content">

            {/* Header */}
            <header className="chat-header">

                <div className="chat-user">
                    <div className="chat-user-avatar">{displayName.charAt(0).toUpperCase()}</div>

                    <div>
                        <h3>{displayName}</h3>
                        <span>@{otherUser?.username}</span>
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
                    value={messageText}
                    onChange={(event) =>
                        setMessageText(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSend();
                        }
                    }}
                />

                <button
                    className="send-button"
                    onClick={handleSend}
                >
                    ➤
                </button>

            </div>

        </div>
    );
}

export default ChatWindow;