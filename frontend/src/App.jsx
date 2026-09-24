import Register from "./components/Register";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import { useState, useEffect } from "react";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const handleThemeToggle = () => {
    setIsDarkMode((current) => !current);
  }

  useEffect(() => {
    if (isDarkMode){
      document.documentElement.setAttribute("data-theme", "dark");
    }else{
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  

  const handleLogout = () => {
    localStorage.removeItem("access_token:");
    setIsLoggedIn(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token:");

    if (!token) {
        setIsLoading(false);
        return;
    }

    fetch("http://127.0.0.1:8000/api/auth/me/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            console.log("ME response:", response.status);

            if (response.ok) {
                setIsLoggedIn(true);
            }

            setIsLoading(false);
        });
  }, []);


  if (isLoading){
    return <p>Checking Authentication....</p>
  }

  if (isLoggedIn){
    return <ChatLayout 
      handleLogout={handleLogout} 
      handleThemeToggle={handleThemeToggle}
    />
  }
  
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}

export default App;