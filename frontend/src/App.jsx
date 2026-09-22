import Register from "./components/Register";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import { useState, useEffect } from "react";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token:");

    if (!token) {
        return;
    }

    fetch("http://127.0.0.1:8000/api/auth/me/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            console.log("ME response:", response.status);

            if (response.ok){
              setIsLoggedIn(true);
            }
        });

  }, []);

  if (isLoggedIn){
    return <ChatLayout />
  }
  
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}

export default App;