import { useState } from "react";

function Login({ setIsLoggedIn }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            email,
            password,
        }
        
        const response = await fetch(
            "http://127.0.0.1:8000/api/auth/login/",
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            }
        );
        const data = await response.json();

        console.log("Login Response:", data);

        if (response.ok){
            localStorage.setItem("access_token:", data.access);
            setIsLoggedIn(true);
        }
    };

    return (
        <div className="login-container">

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;