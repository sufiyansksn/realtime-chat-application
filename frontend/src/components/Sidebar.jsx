import "./Sidebar.css";


function Sidebar({ selectedChat, setSelectedChat, rooms, handleLogout, handleThemeToggle }) {
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
                />
            </div>

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