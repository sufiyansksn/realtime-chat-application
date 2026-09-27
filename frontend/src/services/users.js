export async function searchUsers(query) {
    const token = localStorage.getItem("access_token:");

    const response = await fetch(
        `http://127.0.0.1:8000/api/users/search/?username=${encodeURIComponent(query)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search users");
    }

    const data = await response.json();

    return data;
}