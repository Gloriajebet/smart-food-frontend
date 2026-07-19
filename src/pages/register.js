import "../styles/register.css";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiUser, FiMail } from "react-icons/fi";
import { RiLockLine } from "react-icons/ri";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    setLoading(true);
    try {
        const response = await fetch(
            "https://smart-food-dyp3.onrender.com/api/register/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            alert(data.error || "Registration failed.");
            return;
        }
        alert("Registration successful!");
        navigate("/");
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        setLoading(false);
    }
};

  return(

    <div className="register-container">

      <div className="top-nav">
        <FaArrowLeft 
        className="register-back-icon"
        onClick={() => navigate("/")} 
        />
      </div>

      <div className="register-header">
        <h1>Create Account</h1>
        <p>Fill in the details to get started</p>
      </div>

      <form 
      className="register-form"
      onSubmit={handleSubmit}
      >

        <div className="input-group">
          <FiUser className="icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiMail className="icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <RiLockLine className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <AiOutlineEye 
              className="eye-icon" 
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <AiOutlineEyeInvisible 
              className="eye-icon" 
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <div className="input-group">
          <RiLockLine className="icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {showConfirmPassword ? (
            <AiOutlineEye 
              className="eye-icon" 
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <AiOutlineEyeInvisible 
              className="eye-icon" 
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>

        <button 
        type="submit"
        className="register-btn"
        disabled={loading}>
          {loading ?
          "CREATING ACCOUNT..."
          :"REGISTER"
}
        </button>
      </form>

      <div className="login-link">
        Already have an account?
        <Link to="/">
          Login
        </Link>
      </div>

      {/* bottom curve */}
      <div className="register-bottom-middle"></div>
      <div className="register-bottom"></div>

    </div>
  );
}

export default Register;