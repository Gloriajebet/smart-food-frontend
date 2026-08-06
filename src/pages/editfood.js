import "../styles/editfood.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
} from "react-icons/fi";

import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";

function EditFood() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage] = useState("");
    

   const [food, setFood] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    purchase_date: "",
    expiry_date: "",
    price: "",
    storage_location: "",
    notes: ""
});

    useEffect(() => {
        const loadFood = async () => {
            try {
                const response = await fetchWithAuth(
                    `https://smart-food-dyp3.onrender.com/api/fooditems/${id}/`,
                    {
                        headers: authHeaders()
                    }
                );
                if (!response.ok) {
                    throw new Error("Unable to load food item");
                }
                const data = await response.json();
                setFood({
    name: data.name,
    quantity: data.quantity,
    unit: data.unit,
    category: data.category,
    purchase_date: data.purchase_date,
    expiry_date: data.expiry_date,
    price: data.price || "",
    storage_location: data.storage_location || "",
    notes: data.notes || ""
});
            } catch (error) {
                console.error(error);
                alert("Failed to load food.");
            } finally {
                setLoading(false);
            }
        };
        loadFood();
    }, [id]);

    const handleChange = (e) => {
        setFood({
            ...food,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowSaveConfirm(true);
    };

    const confirmSaveFood = async () => {
        setSaving(true);
        setShowSaveConfirm(false);
        try {
            const response = await fetchWithAuth(
                `https://smart-food-dyp3.onrender.com/api/fooditems/${id}/`,
                {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(food)
                }
            );
            if (!response.ok) {
                throw new Error("Update failed");
            }
            navigate("/inventory");
        }
        catch (error) {
            console.error(error);
            alert("Unable to update food.");
        }
        finally{
            setSaving(false);
        }
    };


    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="edit-food-container">

            <div className="edit-food-header">
                <FiArrowLeft
                    className="edit-food-back-icon"
                    onClick={() => navigate("/inventory")}
                />
                <h2>Edit Food Item</h2>
            </div>

            <form 
            className= "food-form"
            onSubmit={handleSubmit}
            >

                <label>Food Name</label>

                <input
                    type="text"
                    name="name"
                    value={food.name}
                    onChange={handleChange}
                    required
                />


                <label>Quantity</label>
                <div className="row">

                 <input
                    type="number"
                    name="quantity"
                    value={food.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    required
                />
                <select
        name="unit"
        value={food.unit}
        onChange={handleChange}
        required
    >
        <option value="">Select Unit</option>
          <option>Bags.</option>
          <option>Bottles.</option>
          <option>Boxes.</option>
          <option>Bundles.</option>
          <option>Cans.</option>
          <option>Cartons.</option>
          <option>Crates.</option>
          <option>Cups.</option>
          <option>Dozens.</option>
          <option>Fluid Ounces (fl oz).</option>
          <option>Grams (g).</option>
          <option>Items.</option>
          <option>Jars.</option>
          <option>Kilograms (kg).</option>
          <option>Liters (L).</option>
          <option>Loaves.</option>
          <option>Milligrams (mg).</option>
          <option>Milliliters (ml).</option>
          <option>Ounces (oz).</option>
          <option>Packets.</option>
          <option>Pieces.</option>
          <option>Pounds (lbs).</option>
          <option>Rolls.</option>
          <option>Sachets.</option>
          <option>Sacks.</option>
          <option>Servings.</option>
          <option>Sheets.</option>
          <option>Sticks.</option>
          <option>Tablespoons (tbsp).</option>
          <option>Teaspoons (tsp).</option>
          <option>Trays.</option>
          <option>Units.</option>
          <option>Others Units.</option>

        </select>
        </div>

                <label>Category</label>

                <input
                    type="text"
                    name="category"
                    value={food.category}
                    onChange={handleChange}
                    required
                />
                <select
    name="category"
    value={food.category}
    onChange={handleChange}
    required
>
   <option value="">Select Category</option>
          <option>Bakery (Breads&Buns, Pastries&Sweet Goods, Cakes&Muffins, Biscuits&Cookies, etc).</option>
          <option>Beverages (Carbonated Drinks, Juices, Energy&Sports Drinks, etc).</option>
          <option>Cereals (Rice, Wheat, Maize, Oats, Barley, etc).</option>
          <option>Condiments (Ketchup, Mustard, Mayonnaise, etc).</option>
          <option>Dark Green Leafy Vegetables (Spinach, Kale, Swiss Chard, etc).</option>
          <option>Eggs (Chicken, Duck, Quail, etc).</option>
          <option>Fats & Oils (Olive Oil, Coconut Oil, etc).</option>
          <option>Fish & Seafood (Salmon, Tuna, Shrimp, etc).</option>
          <option>Frozen Foods (Frozen Vegetables, Frozen Fruits, etc).</option>
          <option>Herbs & Spices (Basil, Oregano, Cumin, etc).</option>
          <option>Legumes, Nuts & Seeds (Lentils, Almonds, Chia Seeds, etc).</option>
          <option>Meat, Poultry & Offal (Beef, Pork, Chicken, Organ Meats(Liver, Kidneys) etc).</option>
          <option>Milk & Dairy Products (Milk, Cheese, Yogurt, etc).</option>
          <option>Other Fruits (Apples, Bananas, Grapes, etc).</option>
          <option>Other Vegetables (Tomatoes, Eggplant, Cauliflower, Onions, etc).</option>
          <option>Prepared Meals (Ready-to-Eat Meals, etc).</option>
          <option>Snacks (Chips, Cookies, etc).</option>
          <option>Vitamin A- Rich Fruits (Mangoes, Papayas, Apricots,etc).</option>
          <option>Vitamin A- Rich Vegetables & Tubers (Carrots, Pumpkins, Sweet Potatoes, etc).</option>
          <option>Water.</option>
          <option>White Roots & Tubers (Potatoes, Yams, Cassava, etc).</option>
          <option>Other Category.</option>
        </select>


                <label>Purchase Date</label>

<input
    type="date"
    name="purchase_date"
    value={food.purchase_date}
    onChange={handleChange}
/>

                <label>Expiry Date</label>

                <input
                    type="date"
                    name="expiry_date"
                    value={food.expiry_date}
                    onChange={handleChange}
                    required
                />

                <label>Price (KSh)</label>

       <input
    type="number"
    name="price"
    value={food.price}
    onChange={handleChange}
    placeholder="Enter price"
    required
/>

                <label>Storage Location</label>

                <input
                type="text"
                name="storage_location"
                value={food.storage_location}
                onChange={handleChange}
                placeholder="Storage Location"
                required
                />

                <label>Additional Notes</label>

                 <textarea
    name="notes"
    value={food.notes}
    onChange={handleChange}
    placeholder="Additional Notes"
/>

                <button
    type="submit"
    className="save-btn"
    disabled={saving}
>

    {saving
        ? "UPDATING..."
        : "UPDATE ITEM"}
</button>

            </form>
            {showSaveConfirm && (

<div className="confirm-overlay">

    <div className="confirm-box">

        <h3>Update Food Item</h3>

        <p>
            Are you sure you want to update this food item?
        </p>

        <div className="confirm-buttons">

            <button
                className="cancel-btn"
                onClick={() => setShowSaveConfirm(false)}
            >
                Cancel
            </button>

            <button
                className="confirm-btn"
                onClick={confirmSaveFood}
            >
                Save
            </button>

        </div>

    </div>

</div>

)}

{showErrorPopup && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <h3>Incomplete Form</h3>

      <p>{errorMessage}</p>

      <div className="confirm-buttons">
        <button
          className="confirm-btn"
          onClick={() => setShowErrorPopup(false)}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}


        </div>

    );

}

export default EditFood;