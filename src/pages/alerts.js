import "../styles/alerts.css";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";

import {
  FiMenu,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";


import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";

function Alerts() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await fetchWithAuth(
        `https://smart-food-dyp3.onrender.com/api/alerts/`,
        {
          headers: authHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to load alerts.");
      }
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAlerts = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    fetchAlerts();
  }, [user.user_id]);

  if (loading) {
    return (
      <div className="alerts-container">
        <h2>Loading Alerts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-container">
        <h2>{error}</h2>
      </div>
    );
  }

  return (

    <div className="alerts-container">
      <Sidebar 
      isOpen={sidebarOpen} 
      onClose={() => setSidebarOpen(false)} 
      />

      <div className="alerts-header">

        <FiMenu
          className="header-icon"
          onClick={() => setSidebarOpen(true)}
        />

        <h2>Expiry Alerts</h2>

        <FiRefreshCw
    className={`header-icon ${refreshing ? "spin" : ""}`}
    onClick={refreshAlerts}
/>

      </div>

      <div className="alerts-list">

        {alerts.length === 0 ? (

          <div className="no-alerts">

            <FiAlertTriangle className="empty-icon" />

            <h3>No Alerts</h3>

            <p>All your food items are still fresh.</p>

          </div>

        ) : (

          alerts.map((food) => (

            <div
              className={`alert-card ${
                food.status === "Expired"
                  ? "expired"
                  : "expiring"
              }`}
              key={food.id}
            >

              <FiAlertTriangle className="alert-icon" />

              <div className="alert-details">

                <h3>{food.name}</h3>

                <p>
                  {food.quantity} {food.unit}
                </p>

                <p>
                  Category: {food.category}
                </p>

                <p>
                  Expiry Date: {food.expiry_date}
                </p>

              </div>

              <span className="status-badge">
                {food.status}
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Alerts;