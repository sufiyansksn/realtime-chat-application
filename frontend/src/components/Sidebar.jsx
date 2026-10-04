import "./Sidebar.css";
import { useState, useEffect } from "react";
import { searchUsers } from "../services/users";
import { getChatRequests, acceptChatRequest } from "../services/requests";

function Sidebar({
    selectedChat,
    setSelectedChat,
    rooms,
    handleLogout,
    handleThemeToggle
}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [showRequests, setShowRequests] = useState(false);
    const [chatRequests, setChatRequests] = useState([]);

    useEffect(() => {
        const loadChatRequests = async () => {
            try {
                const requests = await getChatRequests();
                setChatRequests(requests);
            } catch (error) {
                console.error("Failed to load chat requests:", error);
            }
        };

        loadChatRequests();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const users = await searchUsers(searchQuery);

            console.log("search results:", users);

            setSearchResults(users);
        } catch (error) {
            console.error("User search failed:", error);
            setSearchResults([]);
        }
    };

    const handleRequests = () => {
        setShowRequests((previous) => !previous);
    };

    const handleAccept = async (requestId) => {
        try{
            const response = await acceptChatRequest(requestId);
            console.log("Chat request accepted:", response);
        }catch(error){
            console.log("Failed to accept the request:", error);
        }
    };

    return (
        <div className="sidebar-content">

            {/* Profile */}
            <div className="profile">

                <div className="profile-avatar">
                    S
                </div>

                <div className="profile-info">
                    <h3>Sufiyan</h3>
                    <span>Online</span>
                </div>

                <button
                    className="settings-button"
                    onClick={handleThemeToggle}
                >
                    ⛭
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>


            {/* Search + Requests */}
            <div className="search-actions">

                {/* Search */}
                <div className="search-box">

                    <span>🔎</span>

                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                </div>


                {/* Requests */}
                <button
                    className="requests-icon-button"
                    onClick={handleRequests}
                >

                    <span className="requests-icon">
                        👥
                    </span>

                    {chatRequests.length > 0 && (
                        <span className="requests-badge">
                            {chatRequests.length}
                        </span>
                    )}

                </button>

            </div>


            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="search-results">

                    {searchResults.map((user) => (

                        <div
                            className="search-result-item"
                            key={user.id}
                        >

                            <div className="chat-avatar">
                                {user.username
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="chat-info">

                                <h4>
                                    {user.username}
                                </h4>

                            </div>

                        </div>

                    ))}

                </div>
            )}


            {/* Requests Panel */}
            {showRequests && (
                <div className="requests-panel">

                    <div className="requests-panel-header">

                        <h3>
                            Chat Requests
                        </h3>

                        <button
                            className="close-requests-button"
                            onClick={() =>
                                setShowRequests(false)
                            }
                        >
                            ×
                        </button>

                    </div>


                    {chatRequests.length === 0 ? (

                        <p className="no-requests">
                            No pending requests
                        </p>

                    ) : (

                        chatRequests.map((request) => (

                            <div
                                className="request-item"
                                key={request.id}
                            >

                                <div className="chat-avatar">
                                    {request.sender.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="request-info">

                                    <h4>
                                        {request.sender.username}
                                    </h4>

                                    <p>
                                        Wants to chat with you
                                    </p>

                                    <div className="request-actions">

                                        <button className="accept-button"
                                                onClick={() => handleAccept(request.id)}
                                        >
                                            Accept
                                        </button>

                                        <button className="decline-button">
                                            Decline
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>
            )}


            {/* Chats List */}
            <div className="chat-list">

                {rooms.map((room) => (

                    <div
                        key={room.id}
                        className={`chat-item ${
                            selectedChat === room.name
                                ? "active-chat"
                                : ""
                        }`}
                        onClick={() =>
                            setSelectedChat(room.name)
                        }
                    >

                        <div className="chat-avatar">
                            {room.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="chat-info">

                            <h4>
                                {room.name}
                            </h4>

                            <p>
                                Start chatting...
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Sidebar;