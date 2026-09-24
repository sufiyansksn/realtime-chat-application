import "./ChatLayout.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { useState, useEffect } from "react";

import { getChatRooms } from "../services/auth";

function ChatLayout({ handleLogout, handleThemeToggle }) {

    const[selectedChat, setSelectedChat] = useState("");
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getChatRooms().then((rooms) => {
            setRooms(rooms)
        })
        .catch((error) => {
            console.error("getChatrooms error:", error);
        });
    },[]);

    return (
        <div className="chat-layout">

        {/* Left side */}
        <aside className="sidebar">
            <Sidebar 
                selectedChat = {selectedChat}
                setSelectedChat = {setSelectedChat}
                rooms = {rooms}
                handleLogout = {handleLogout}
                handleThemeToggle = {handleThemeToggle}
            />
        </aside>

        {/* Right side */}
        <main className="chat-window">
            <ChatWindow 
                selectedChat={selectedChat}
                rooms={rooms}
            />

        </main>

        </div>
    );
}

export default ChatLayout;