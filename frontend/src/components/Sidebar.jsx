import "./Sidebar.css";
import { useState } from "react";
import { searchUsers } from "../services/users";


function Sidebar({ selectedChat, setSelectedChat, rooms, handleLogout, handleThemeToggle }) {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()){
            setSearchResults([]);
        }

        try{
            const users = await searchUsers(searchQuery);
            console.log("search results:", users);
            setSearchResults(users)
        }catch (error) {
            console.error("User search failed:", error)
            setSearchResults([]);
        }
    }

    return (
        <div className="sidebar-content">

            {/* Profile */}
            <div className="profile">
                <div className="profile-avatar">S</div>

                <div className="profile-info">
                    <h3>Sufiyan</h3>
                    <span>Online</span>
                </div>

                <button className="settings-button"
                    onClick={handleThemeToggle}
                >
                    ⛭
                </button>
                <button onClick={handleLogout} >Logout</button>
            </div>

            

            {/* Search bar */}
            <div className="search-box">
                <span>🔎</span>
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
            </div>
            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div className="search-result-item" key={user.id}>
                            <div className="chat-avatar">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <div className="chat-info">
                                <h4>{user.username}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chats List */}
            <div className="chat-list">

                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`chat-item ${
                            selectedChat === room.name ? "active-chat" : ""
                        }`}
                        onClick={() => setSelectedChat(room.name)}
                    >

                        <div className="chat-avatar">
                            {room.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="chat-info">
                            <h4>{room.name}</h4>
                            <p>Start chatting...</p>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

export default Sidebar;