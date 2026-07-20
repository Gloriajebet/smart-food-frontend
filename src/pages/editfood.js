import "../styles/addfood.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiSave
} from "react-icons/fi";

import { authHeaders } from "../components/api";
import { fetchWithAuth } from "../components/api";

function EditFood() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

   const [food, setFood] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    purchase_date: "",
    expiry_date: "",
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
        setSaving(true);
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

        <div className="add-food-container">

            <div className="add-food-header">
                <FiArrowLeft
                    className="add-food-back-icon"
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

                <label>Category</label>

                <input
                    type="text"
                    name="category"
                    value={food.category}
                    onChange={handleChange}
                    required
                />

                <label>Quantity</label>

                <input
                    type="number"
                    name="quantity"
                    value={food.quantity}
                    onChange={handleChange}
                    required
                />

                <label>Unit</label>

                <input
                    type="text"
                    name="unit"
                    value={food.unit}
                    onChange={handleChange}
                    required
                />

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

                <label>Storage Location</label>

                <input
                type="date"
                name="storage_location"
                value={food.storage_location}
                onChange={handleChange}
                required
                />

                <label>Additional Notes</label>

<textarea
    name="notes"
    value={food.notes}
    onChange={handleChange}
/>

                <button
    type="submit"
    className="save-btn"
    disabled={saving}
>
    <FiSave />

    {loading
        ? "UPDATING..."
        : "UPDATE ITEM"}
</button>

            </form>

        </div>

    );

}

export default EditFood;