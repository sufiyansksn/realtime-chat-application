export async function getCurrentUser(){
    const token = localStorage.getItem("access_token:");

    const response = await fetch(
        "http://127.0.0.1:8000/api/auth/me/",
        {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();


    return data;
}

export async function getChatRooms() {
    const token = localStorage.getItem("access_token:");

    const response = await fetch(
        "http://127.0.0.1:8000/api/chat/rooms/",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    return data;
}