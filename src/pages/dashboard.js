import "../styles/dashboard.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  FiMenu,
  FiPlusCircle,
  FiHome,
  FiUser,
} from "react-icons/fi";

import { VscGraph } from "react-icons/vsc";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { TfiBell } from "react-icons/tfi";
import { SlClock } from "react-icons/sl";
import { MdOutlineRestaurant, MdInventory2 } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";

import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";
import Sidebar from "../components/sidebar";
import basket from "../assets/basket.jpg";

function Dashboard() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [summary, setSummary] = useState({
    total_items: 0,
    expiring_soon: 0,
    expired: 0
});

const [foods, setFoods] = useState([]);
const [recipes, setRecipes] = useState([]);

const user = JSON.parse(localStorage.getItem("user")) || {};

useEffect(() => {
    const fetchDashboard = async () => {
        try {
            const dashboardResponse = await fetchWithAuth(
                "https://smart-food-dyp3.onrender.com/api/dashboard/",
                {
                    headers: authHeaders(),
                }
            );

            const dashboardData = await dashboardResponse.json();

            setSummary(dashboardData);

            const foodResponse = await fetchWithAuth(
                "https://smart-food-dyp3.onrender.com/api/fooditems/"
            );

            const foodData = await foodResponse.json();

            setFoods(
                Array.isArray(foodData)
                    ? foodData
                    : foodData.results
            );

            const recipeResponse = await fetchWithAuth(
                "https://smart-food-dyp3.onrender.com/api/recipes/"
            );

            const recipeData = await recipeResponse.json();

            setRecipes(
                Array.isArray(recipeData)
                    ? recipeData
                    : recipeData.results
            );

        }

        catch(error){

            console.error(error);

        }

    };

    fetchDashboard();

}, []);

const inventoryNames = foods.map(food =>
    food.name.toLowerCase()
);

const suggestedMeals = recipes
.map(recipe => {
    let ingredients = [];
    if (Array.isArray(recipe.ingredients)) {
        ingredients = recipe.ingredients;
    }

    else if (typeof recipe.ingredients === "string") {

        ingredients = recipe.ingredients
            .replace(/[[\]"]/g, "")
            .replace(/'/g, "")
            .split(",")
            .map(item => item.trim())
            .filter(item => item !== "");

    }

    const available = ingredients.filter(item =>
        inventoryNames.includes(item.toLowerCase())
    );

    return {

        ...recipe,

        percentage:
            ingredients.length === 0
                ? 0
                : Math.round(
                    (available.length / ingredients.length) * 100
                )

    };

})
.sort((a, b) => b.percentage - a.percentage);

const bestMeal = suggestedMeals[0];


  return (
    <div className="dashboard-container">
                 <Sidebar 
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
            />

      <div className="dashboard-header">
        {showNotifications && (

<div className="notification-panel">

    <h3>Notifications</h3>

    {summary.expired > 0 && (

        <div className="notification-item danger">

            🔴
            <div>

                <strong>{summary.expired} Expired Item(s)</strong>

                <p>These foods should be removed from inventory.</p>

            </div>

        </div>

    )}

    {summary.expiring_soon > 0 && (

        <div className="notification-item warning">

            🟡
            <div>

                <strong>{summary.expiring_soon} Item(s) Expiring Soon</strong>

                <p>Use these ingredients before they expire.</p>

            </div>

        </div>

    )}

    {summary.expired === 0 &&
     summary.expiring_soon === 0 && (

        <div className="notification-item success">

            🟢
            <div>

                <strong>Everything looks good!</strong>

                <p>No food is close to expiring.</p>

            </div>

        </div>

    )}

    <button
        className="view-alerts-btn"
        onClick={() => navigate("/alerts")}
    >
        View All Alerts
    </button>

</div>

)}

        <FiMenu
          className="header-icon"
          onClick={() => setSidebarOpen(true)}
          />

        <h2>Dashboard</h2>

<div
    className="notification-wrapper"
    onClick={() =>
        setShowNotifications(!showNotifications)
    }
>
    <TfiBell className="header-icon" />

    {(summary.expired > 0 || summary.expiring_soon > 0) && (
        <span className="notification-badge">
            {summary.expired + summary.expiring_soon}
        </span>
    )}
</div>

      </div>

      <div className="welcome-card">

        <div className="welcome-text">

          <h3>Hello, {user.username || "User"}! 👋</h3>

          <p>
            Here's your food summary
          </p>

        </div>

        <img
          src={basket}
          alt="basket"
          className="basket-image"
        />

      </div>

      <div className="stats-section">

        <div className="stat-card green">

          <LiaShoppingBagSolid className="stat-icon" />
          <div className="stat-info">

          <h2>{summary.total_items}</h2>

          <p>Total Items</p>
          </div>

        </div>

        <div className="stat-card orange">

          <SlClock className="stat-icon" />
          <div className="stat-info">

          <h2>{summary.expiring_soon}</h2>

          <p>Expiring Soon</p>
          </div>

        </div>

        <div className="stat-card red">

          <TfiBell className="stat-icon" />
          <div className="stat-info">

          <h2>{summary.expired}</h2>

          <p>Alerts</p>
          </div>

        </div>

      </div>

      <h3 className="section-title">
        Quick Actions
      </h3>

      <div className="actions-grid">

        <div
          className="action-card"
          onClick={() => navigate("/add-food")}
        >
          <FiPlusCircle />
          <span>Add Food Item</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/inventory")}
        >
          <MdInventory2 />
          <span>View Inventory</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/meals")}
        >
          <MdOutlineRestaurant />
          <span>Meal Suggestions</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/reports")}
        >
          <VscGraph />
          <span>Reports & Analytics</span>
        </div>

      </div>

      <div
    className="suggestion-card"
    onClick={() => bestMeal && navigate(`/recipe/${bestMeal.id}`)}
>

    <span className="suggestion-label">

        Today's Suggestion

    </span>

    {bestMeal ? (

        <>

            {bestMeal.image && (

                <img
                    src={bestMeal.image}
                    alt={bestMeal.name}
                    className="basket-image"
                />

            )}

            <h3>{bestMeal.name}</h3>

            <p>

                {bestMeal.percentage}% Ingredient Match

            </p>

            <small>

                {bestMeal.category}

            </small>

        </>

    ) : (

        <>

            <h3>No Recipe Suggestions</h3>

            <p>Add recipes to get recommendations.</p>

        </>

    )}

</div>

      <div className="dashboard-bottom-nav">

        <div className="dashboard-nav-item active">
          <FiHome />
          <span>Home</span>
        </div>

        <div
          className="dashboard-nav-item"
          onClick={() => navigate("/inventory")}
        >
          <MdInventory2 />
          <span>Inventory</span>
        </div>

        <div
          className="dashboard-nav-item"
          onClick={() => navigate("/meals")}
        >
          <ImSpoonKnife />
          <span>Meals</span>
        </div>

        <div
          className="dashboard-nav-item"
          onClick={() => navigate("/alerts")}
        >
          <TfiBell />
          <span>Alerts</span>
        </div>

        <div
          className="dashboard-nav-item"
          onClick={() => navigate("/profile")}
        >
          <FiUser />
          <span>Profile</span>
        </div>

      </div>
  </div>
  );
}

export default Dashboard;
