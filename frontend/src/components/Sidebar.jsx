import "./Sidebar.css";


function Sidebar({ selectedChat, setSelectedChat}) {
    return (
        <div className="sidebar-content">

            {/* Profile */}
            <div className="profile">
                <div className="profile-avatar">S</div>

                <div className="profile-info">
                    <h3>Sufiyan</h3>
                    <span>Online</span>
                </div>

                <button className="settings-button">⛭</button>
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

                <div className={`chat-item ${selectedChat === "Ahmed" ? "active-chat" : "" }`}
                    onClick={() => setSelectedChat("Ahmed")} >

                    <div className="chat-avatar">A</div>
                    <div className="chat-info">
                        <h4>Ahmed</h4>
                        <p>Hey, how are you?</p>
                    </div>

                    <span className="chat-time">10:30</span>
                </div>

                <div className={`chat-item ${selectedChat === "Family" ? "active-chat" : "" }`}
                    onClick={() => setSelectedChat("Family")} >

                    <div className="chat-avatar">F</div>

                    <div className="chat-info">
                        <h4>Family</h4>
                        <p>Good Morning?</p>
                    </div>

                    <span className="chat-time">09:15</span>
                </div>

                <div className={`chat-item ${selectedChat === "Work Group" ? "active-chat" : "" }`}
                    onClick={() => setSelectedChat("Work Group")} >

                    <div className="chat-avatar">W</div>
                    <div className="chat-info">
                        <h4>Work Group!</h4>
                        <p>Meeting at 5</p>
                    </div>

                    <span className="chat-time">Yesterday</span>

                </div>
            </div>

        </div>
    )
}

export default Sidebar;