import { useState } from "react";
import "./Register.css";

function Register({setShowRegister}){
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const registrationData = {
            first_name: firstName,
            last_name: lastName,
            email,
            username,
            password,
            confirm_password: confirmPassword,
        };

        console.log("Registration details:", registrationData);

        const response = await fetch(
            "http://127.0.0.1:8000/api/auth/register/",
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(registrationData),
            }
        );
        
        const data = await response.json()

        console.log("Register response:", data);

        if (response.ok){
            setMessage("Account created successfully!");
            setError("");

            setFirstName("");
            setLastName("");
            setEmail("");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
        } else {
            const firstError = Object.values(data).flat()[0] || "Registration failed";
            setError(firstError);
            setMessage("");
        }

        // console.log("Email:", email)
        // console.log("Username:", username)
        // console.log("Password:", password);
        // console.log("ConfirmPassword:", confirmPassword)
    };

    return (
        <div className="register-page">

            <div className="register-container">

                {/* Sign Up / Log In toggle */}
                <div className="auth-toggle">

                    <button className="active">
                        Sign Up
                    </button>

                    <button 
                        type="button"
                        onClick={() => setShowRegister(false)}
                    >
                        Log In
                    </button>

                </div>

                {/* Heading */}
                <div className="register-heading">

                    <h1>Create An Account</h1>

                    <p>Create your account to start chatting.</p>

                </div>

                {/* Messages */}
                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {/* Registration form */}
                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    {/* First + Last name */}
                    <div className="name-row">

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                            />
                        </div>

                    </div>

                    {/* Username */}
                    <div className="input-group">

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                    </div>

                    {/* Email */}
                    <div className="input-group">

                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>

                    {/* Password */}
                    <div className="input-group">

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>

                    {/* Confirm Password */}
                    <div className="input-group">

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        className="register-button"
                    >
                        Create an Account
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Register;