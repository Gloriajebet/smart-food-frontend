import "../styles/sidebar.css";
import {
  FiHome,
  FiPlusCircle,
  FiBell,
  FiX
} from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineRestaurant, MdInventory2 } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, closeSidebar }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
};

  return (

    <>

      {isOpen && (
        <div
          className="overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        <div className="sidebar-header">

          <h2>Smart Food</h2>

          <FiX
            className="close-icon"
            onClick={closeSidebar}
          />

        </div>

        <div
          className="sidebar-item"
          onClick={() => navigate("/dashboard")}
        >
          <FiHome />
          <span>Dashboard</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => navigate("/inventory")}
        >
          <MdInventory2 />
          <span>Inventory</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => navigate("/add-food")}
        >
          <FiPlusCircle />
          <span>Add Food</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => navigate("/alerts")}
        >
          <FiBell />
          <span>Alerts</span>
        </div>

        <div 
          className="sidebar-item"
          onClick={() => navigate("/meals")}
        >
          <MdOutlineRestaurant />
          <span>Meal Suggestions</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => navigate("/reports")}
        >
          <VscGraph/>
          <span>Reports</span>
        </div>

       <div
    className="sidebar-item logout"
    onClick={logout}
>
    <IoMdLogOut />
    <span>Logout</span>
</div>
      </div>

    </>

  );
}

export default Sidebar;