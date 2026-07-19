import "../styles/forgotpassword.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiArrowLeft, FiMail } from "react-icons/fi";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

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
                alert(data.error);
                return;
            }

            alert(data.message);

            navigate("/");

        }

        catch (error) {

            console.error(error);

            alert("Something went wrong.");

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

            </form>

        </div>

    );

}

export default ForgotPassword;