import "../styles/addrecipe.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import { fetchWithAuth } from "../components/api";

function AddRecipe() {

    const navigate = useNavigate();

    const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    ingredients: "",
    instructions: "",
    cooking_time: "",
    servings: "",
    image: null
});

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     try {
        const formData = new FormData();
        formData.append("name", recipe.name);
        formData.append("category", recipe.category);
        formData.append("cooking_time", recipe.cooking_time);
        formData.append("servings", recipe.servings);
        formData.append(
            "ingredients", 
            JSON.stringify(
                recipe.ingredients
            .split("\n")
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient !== "")
        ));
        formData.append("instructions", recipe.instructions);
        if (recipe.image) {
            formData.append("image", recipe.image);
        }
        const response = await fetchWithAuth(
            "https://smart-food-dyp3.onrender.com/api/recipes/",
            {
                method: "POST",
                body: formData
            }
        );
        if (!response.ok) {
            throw new Error("Failed to save recipe");
        }
        alert("Recipe added successfully!");
        navigate("/meals");
    }
    catch (error) {
        console.error(error);
        alert("Unable to save recipe.");
    }
    finally {
        setLoading(false);
    }
};

return (
 <div className="add-recipe-container">
 <div className="add-recipe-header">

 <FiArrowLeft

 className="add-recipe-back-icon"
 onClick={() => navigate("/meals")}
/>

<h2>Add Recipe</h2>

</div>

<form
 className="add-recipe-form"
  onSubmit={handleSubmit}
>

<label>Recipe Name</label>

<input
 type="text"
 value={recipe.name}
 onChange={(e)=>setRecipe({...recipe, name: e.target.value})}
 placeholder="Enter recipe name"
 required
/>

<label>Category</label>

<select
 value={recipe.category}
 onChange={(e)=>setRecipe({...recipe, category: e.target.value})}
 required
>
 <option value="">Select Category</option>
 <option>Breakfast</option>
 <option>Lunch</option>
 <option>Dinner</option>
 <option>Snack</option>
 <option>Dessert</option>
</select>

<label>Cooking Time (minutes)</label>

<input
 type="number"
 value={recipe.cooking_time}
 onChange={(e)=>setRecipe({...recipe, cooking_time: e.target.value})}
 required
/>

<label>Servings</label>

<input
 type="number"
 value={recipe.servings}
 onChange={(e)=>setRecipe({...recipe, servings: e.target.value})}
 required
/>

<label>Ingredients</label>

<textarea
 rows="6"
 placeholder="One ingredient per line"
 value={recipe.ingredients}
 onChange={(e)=>setRecipe({...recipe, ingredients: e.target.value})}
 required
/>

<label>Instructions</label>

<textarea
  rows="8"
 placeholder="Describe how to prepare the recipe"
 value={recipe.instructions}
 onChange={(e)=>setRecipe({...recipe, instructions: e.target.value})}
 required
/>

<label>Recipe Image</label>

<input
 type="file"
 accept="image/*"
 onChange={(e)=>setRecipe({...recipe, image: e.target.files[0]})}
/>

<button

 type="submit"
 className="save-btn"
 disabled={loading}
>
{loading ? "SAVING..." : "SAVE RECIPE"}
</button>
</form>
</div>
);
}

export default AddRecipe;
