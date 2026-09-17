import "./ChatWindow.css";
import { useState, useEffect, useRef } from "react";
import { createWebSocket } from "../services/websocket";
import { getCurrentUser } from "../services/auth";


const chatRooms = {
    Ahmed: 6,
    Family: 7,
    "Work Group": 8,
};



function ChatWindow({ selectedChat, rooms }){


    //websocket connections 
    const selectedRoom = rooms.find((room) => room.name === selectedChat);
    
    const roomId = selectedRoom?.id;

    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null)

    const [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        getCurrentUser().then((user) => {
            console.log("CurrentUser:", user)
            setCurrentUser(user)
        }) 
        .catch((error) => {
            console.error("getCurrentUser ERROR:", error);
        });
    }, []);

    useEffect(() => {
        
        if ( !currentUser || !roomId ){
            return;
        }

        setMessages([]);

        const socket = createWebSocket(roomId);

        socketRef.current = socket;

        //When the connection actually becomes OPEN, execute this function.
        socket.onopen = () => {
            console.log("Websocket Connected!")
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)

            const formattedMessage = {
                id: message.id,
                type: message.sender === currentUser.id ? "sent" : "received",
                content: message.content,
                time: new Date(message.created_at).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit",}),
            }   

            setMessages((previousMessages) => [
                ...previousMessages,
                formattedMessage,
            ]);

            //console.log("Message from server:", message)
        }
        // stops old websocket connection.
        return () => {
            socket.close();
        };

    }, [roomId, currentUser]);

    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    },[messages])



    const handleSend = () => {
        if (!messageText.trim()) {
            return;
        }

        socketRef.current.send(messageText);

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