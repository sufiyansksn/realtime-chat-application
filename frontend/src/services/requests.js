import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/chat";

export const getChatRequests = async () => {
    const token = localStorage.getItem("access_token:");

    const response = await axios.get(
        `${API_URL}/requests/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


export const acceptChatRequest = async (requesId) => {
    const token = localStorage.getItem("access_token:");

    const response = await axios.post(
        `${API_URL}/request/${requesId}/accept/`,
        {},
        {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}


export const declineChatRequest = async (requestId) => {
    const token = localStorage.getItem("access_token:");

    const response = await axios.post(
        `${API_URL}/request/${requestId}/decline/`,
        {},
        {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}