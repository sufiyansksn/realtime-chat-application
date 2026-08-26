

export function createWebSocket(roomId){
    const socket = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomId}/`
    );

    return socket
}

