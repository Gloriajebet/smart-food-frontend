import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { RiLockLine } from "react-icons/ri";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import vegetables from "../assets/vegan/veggies.png";
import logo from "../assets/BL.png";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch(
            "https://smart-food-dyp3.onrender.com/api/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );
        const data = await response.json();
        console.log(data);
        
        if (!response.ok) {
            alert(data.error || "Invalid username or password");
            return;
        }
        localStorage.setItem(
          "access",
          data.access
        );
        localStorage.setItem(
          "refresh",
          data.refresh
        );
        localStorage.setItem(
            "user",
            JSON.stringify(
              {
                username: data.username,
                email: data.email
              }
            )
        );
        alert("Login successful!");
        navigate("/dashboard");
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="login-container">

        <div className="logo-section">
          <img 
          src={logo} 
          alt="Smart Food Logo"
         className="logo-image"
          />
          <h1>Smart Food</h1>

        <p>
          Optimize Food. Reduce Waste.
        </p>
</div>
        
        <div className="welcome-section">
          <h2>Welcome Back!</h2>
          <span>Login to your account</span>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FiMail className="input-icon" />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="input-group">

            <RiLockLine className="input-icon" />

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

          <div className="login-options">

            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

           <Link
              to="/forgot-password"
              className="forgot-password"
            >
             Forgot Password?
           </Link>

          </div>

          <button
    type="submit"
    className="front-login-btn"
    disabled={loading}
>
    {loading 
    ? "LOGGING IN..." 
    : "LOGIN"}
</button>

        </form>

        <div className="signup-text">
          Don’t have an account?
          <Link to="/register">
            Sign Up
          </Link>
        </div>


        <div className="bottom-section">

  <div className="bottom-curve"></div>

  <img src={vegetables}
    alt="Vegetables"
    className="veggies-image" />

</div>
      </div>

  );
}

export default Login;