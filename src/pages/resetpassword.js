import "../styles/resetpassword.css";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {

    const { uid, token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `https://smart-food-dyp3.onrender.com/api/reset-password/${uid}/${token}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            alert("Password reset successfully!");

            navigate("/");

        } catch (err) {

            alert("Something went wrong.");

        }

        setLoading(false);

    };

    return (

        <div className="forgot-container">

            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    {loading ? "Updating..." : "Reset Password"}
                </button>

            </form>

        </div>

    );

}

export default ResetPassword;