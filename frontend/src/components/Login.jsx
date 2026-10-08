import { useState } from "react";
import "./Login.css"

function Login({ setIsLoggedIn, setShowRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        {/* it clears any previous erros if we have */}
        setError("");

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
        }else{
            const firstError = Object.values(data).flat() [0] || "Login failed";

            setError(firstError)
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                <div className="login-heading">
                    <h1>Welcome back!</h1>
                    <p>Sign in to your account to continue</p>
                </div>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-input-group">

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>

                    <div className="login-input-group">

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>

                    <div className="forgot-password">

                        <button type="button">
                            Forgot password?
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign In
                    </button>

                </form>

                <div className="login-register-link">

                    <span>
                        Don't have an account?{" "}
                    </span>

                    <button type="button"
                        onClick={() => setShowRegister(true)}
                    >
                        Sign Up
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;