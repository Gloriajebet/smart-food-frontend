import "../styles/addfood.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";

function AddFood() {

  const navigate = useNavigate();

 const [foodName, setFoodName] = useState("");
 const [quantity, setQuantity] = useState("");
 const [unit, setUnit] = useState("");
 const [category, setCategory] = useState("");
 const [purchaseDate, setPurchaseDate] = useState("");
 const [expiryDate, setExpiryDate] = useState("");
 const [storageLocation, setStorageLocation] = useState("");
 const [additionalNotes, setAdditionalNotes] = useState("");
 const [price,setPrice]=useState("");
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetchWithAuth(
    "http://192.168.1.69:8000/api/fooditems/",
    {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            name: foodName,
            quantity: quantity,
            unit: unit,
            category: category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate,
            price: price,
            storage_location: storageLocation,
            notes: additionalNotes
        })
    }
);
            
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            alert("Failed to save item");
            return;
        }
        alert("Food item saved successfully!");
        navigate("/inventory");
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="add-food-container">

      <div className="add-food-header">

        <FiArrowLeft
          className="add-food-back-icon"
          onClick={() => navigate("/dashboard")}
        />

        <h2>Add Food Item</h2>

      </div>

      <form 
      className="food-form"
      onSubmit={handleSubmit}>

        <label>Food Name</label>

        <input
          type="text"
          placeholder="Enter food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <label>Quantity</label>

        <div className="row">
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >

          <option>Select Unit</option>
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

         <select
         value={category}
         onChange={(e) => setCategory(e.target.value)}
         >

          <option>Select Category</option>
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
        <div className="row">
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          placeholder="Purchase Date"
        />
        </div>


        <label>Expiry Date</label>
        <div className="row">

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="Expiry Date"
        />
        </div>

        <label>Price (KSh)</label>

        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Storage Location</label> 

        <input
          type="text"
          placeholder="Storage Location"
          value={storageLocation}
          onChange={(e) => setStorageLocation(e.target.value)}
        />
        <label>Additional Notes</label>

        <textarea 
          placeholder="Additional Notes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        >
        </textarea>

        <button 
        type="submit" 
        className="save-btn"
        disabled= {loading}
        >
          {loading 
          ? "SAVING..."
          :"SAVE ITEM"}
        </button>

      </form>

    </div>
  );
}

export default AddFood;