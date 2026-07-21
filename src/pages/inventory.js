
import "../styles/inventory.css";


import {
  FiMenu,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiPlus
} from "react-icons/fi";

import { 
  useState, 
  useEffect, 
 } from "react";

import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

function Inventory() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

useEffect(() => {
  const fetchFoods = async () => {
    try {
      const response = await fetchWithAuth(
        `https://smart-food-dyp3.onrender.com/api/fooditems/`,
        {
          headers: authHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }

      console.log(response.status);
      const data = await response.json();
      console.log(data);
      setFoods(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchFoods();
}, [navigate]);

  const deleteFood = async (id) => {

    const confirmDelete = window.confirm(
        "Delete this food item?"
    );

    if (!confirmDelete) return;

    try {

        // Start animation
        setDeletingId(id);

        const response = await fetchWithAuth(
            `https://smart-food-dyp3.onrender.com/api/fooditems/${id}/`,
            {
                method: "DELETE",
                headers: authHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        // Wait for animation
        setTimeout(() => {

            setFoods(prevFoods =>
                prevFoods.filter(food => food.id !== id)
            );

            setDeletingId(null);

        }, 300);

    } catch (error) {

        console.error(error);

        setDeletingId(null);

        alert("Unable to delete food. Please try again.");

    }

};

const markAsUsed = async (id) => {

    const confirmUse = window.confirm(
        "Are you sure you have used this food item?"
    );

    if (!confirmUse) {
        return;
    }

    try {

        const response = await fetchWithAuth(
            `https://smart-food-dyp3.onrender.com/api/fooditems/${id}/mark-used/`,
            {
                method: "PATCH"
            }
        );

        if (!response.ok) {
            alert("Failed to mark item as used.");
            return;
        }

        alert("✅ Food item marked as used successfully!");

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

};

  const today = new Date();

const filteredFoods = foods.filter(food => {
    const expiry = new Date(food.expiry_date);

    const matchesSearch =
        food.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "expiring") {
        return (
            matchesSearch &&
            expiry >= today &&
            expiry <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
        );
    }

    if (activeTab === "expired") {
        return matchesSearch && expiry < today;
    }

    return matchesSearch;
});

  if (loading) {
    return <h2>Loading inventory...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div className="inventory-container">
      <Sidebar 
      isOpen={sidebarOpen}
      closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="inventory-header">
        <FiMenu 
        className="header-icon"
        onClick={() => setSidebarOpen(true)}
         />

        <h2>My Inventory</h2>

        <FiSearch 
        className="header-icon"
        onClick={() => setShowSearch(!showSearch)}
         />
      </div>

      {showSearch && (
      <div className="floating-search">
        <input
          type="text"
          placeholder="Search food item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      )}

      <div className="tabs">
        <button
  className={
    activeTab === "all"
      ? "active-tab"
      : ""
  }
  onClick={() =>
    setActiveTab("all")
  }
>
  All Items
</button>
        <button
  className={
    activeTab === "expiring"
      ? "active-tab"
      : ""
  }
  onClick={() =>
    setActiveTab("expiring")
  }
>
  Expiring Soon
</button>
        <button
  className={
    activeTab === "expired"
      ? "active-tab"
      : ""
  }
  onClick={() =>
    setActiveTab("expired")
  }
>
  Expired
</button>
      </div>

      <div className="inventory-list">
       {filteredFoods.length === 0 ? (

    <div className="empty-inventory">

        <h2>No food items found.</h2>

        <p>
            Click the + button to add your first food item.
        </p>

    </div>

) : (
          filteredFoods.map((food) => (
            <div
    key={food.id}
    className={
        deletingId === food.id
            ? "inventory-card deleting"
            : "inventory-card"
    }
>
              <div className="food-details">
                <h4>{food.name}</h4>
                <p>{food.quantity} {food.unit} . {food.category}</p>
              </div>

              <span className={`expiry`}>
                {new Date(food.expiry_date).toLocaleDateString()}
              </span>

              <FiEdit3
  className="action-icon edit"
  onClick={() =>
    navigate(
      `/edit-food/${food.id}`
    )
  }
/>

              <FiTrash2
                className="action-icon delete"
                onClick={() => deletingId === null && deleteFood(food.id)}
              />

             {!food.is_used ? (

<button
    className="used-btn"
    onClick={() => markAsUsed(food.id)}
>
    Mark as Used
</button>

) : (

<p className="used-label">
    Used
</p>

)}
            </div>
          ))
        )}
      </div>
      <button
        className="floating-btn"
        onClick={() => navigate("/add-food")}
      >
        <FiPlus />
      </button>
    </div>
  );
}

export default Inventory;

    