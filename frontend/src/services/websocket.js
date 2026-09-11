

export function createWebSocket(roomId){
    const token = localStorage.getItem("access_token:");

    const socket = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`
    );

    return socket
}

