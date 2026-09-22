import { useState } from "react";

function Register(){
    
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const registrationData = {
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
        <div className="register-container">
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <h1>Create an Account</h1>

            <form onSubmit ={handleSubmit} >

                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        value = {email}
                        onChange = {(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Choose a username" 
                        value = {username}
                        onChange = {(event) => setUsername(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Create a Password" 
                        value = {password}
                        onChange = {(event) => setPassword(event.target.value)}
                    />
                </div>

                <div>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value = {confirmPassword}
                        onChange = {(event) => setConfirmPassword(event.target.value)}
                    />
                </div>

                <button type="submit">
                    Create Account
                </button>

            </form>

        </div>
    );
}

export default Register;