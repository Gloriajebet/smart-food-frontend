import "../styles/forgotpassword.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiArrowLeft, FiMail } from "react-icons/fi";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "https://smart-food-dyp3.onrender.com/api/forgot-password/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await response.json();

           if (!response.ok) {
            setMessage(data.message || "Failed to send reset link");
    return;
}

            alert(data.message);

            navigate("/");

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="forgot-container">

            <div className="forgot-header">

                <FiArrowLeft
                    className="back-icon"
                    onClick={() => navigate("/")}
                />

                <h2>Forgot Password</h2>

            </div>

            <p>

                Enter your email address and we'll send you a password reset link.

            </p>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div className="input-group">

                    <FiMail className="input-icon" />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? "SENDING..." : "SEND RESET LINK"}
                </button>

                {message && (
    <p className="success-message">
        {message}
    </p>
)}

            </form>

        </div>

    );

}

export default ForgotPassword;