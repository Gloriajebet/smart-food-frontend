import "../styles/profile.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../components/api";

import {
    FiArrowLeft,
    FiUser,
    FiMail,
    FiLock,
    FiLogOut
} from "react-icons/fi";

function Profile() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/");

    };

    useEffect(() => {

    const loadProfile = async () => {

        try {

            const response = await fetchWithAuth(
                "http://192.168.1.69:8000/api/profile/"
            );

            const data = await response.json();

            setUsername(data.username);
            setEmail(data.email);

        }

        catch(error){

            console.error(error);

        }

    };

    loadProfile();

}, []);

const saveProfile = async () => {

    try {

        const response = await fetchWithAuth(

            "http://192.168.1.69:8000/api/profile/",

            {

                method: "PUT",

                body: JSON.stringify({

                    username,

                    email

                })

            }

        );

        const data = await response.json();

        localStorage.setItem(

            "user",

            JSON.stringify(data)

        );

        alert("Profile updated successfully!");

    }

    catch(error){

        console.error(error);

        alert("Unable to update profile.");

    }

};

    return (

        <div className="profile-container">

            <div className="profile-header">

                <FiArrowLeft
                    className="profile-back-icon"
                    onClick={() => navigate("/dashboard")}
                />

                <h2>Profile</h2>

            </div>

            <div className="profile-avatar">

                <FiUser />

            </div>

            <div className="profile-form">

                <label>Username</label>

                <div className="profile-input">

                    <FiUser />

                    <input
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />

                </div>

                <label>Email</label>

                <div className="profile-input">

                    <FiMail />

                    <input
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                </div>

               <button
                className="save-btn"
                onClick={saveProfile}
               >

                    Save Changes

                </button>

                <button
                    className="change-password-btn"
                    onClick={()=>navigate("/forgot-password")}
                >

                    <FiLock />

                    Change Password

                </button>

                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <FiLogOut />

                    Logout

                </button>

            </div>

        </div>

    );

}

export default Profile;