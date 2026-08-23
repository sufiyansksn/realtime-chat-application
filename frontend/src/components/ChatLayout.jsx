import "./ChatLayout.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { useState } from "react";

function ChatLayout() {

    const[selectedChat, setSelectedChat] = useState("Ahmed");

    return (
        <div className="chat-layout">

        {/* Left side */}
        <aside className="sidebar">
            <Sidebar 
                selectedChat = {selectedChat}
                setSelectedChat = {setSelectedChat}
            />
        </aside>

        {/* Right side */}
        <main className="chat-window">
            <ChatWindow selectedChat={selectedChat} />
        </main>

        </div>
    );
}

export default ChatLayout;