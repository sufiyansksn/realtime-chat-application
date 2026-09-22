import Register from "./components/Register";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";
import { useState } from "react";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn){
    return <ChatLayout />
  }
  
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}

export default App;