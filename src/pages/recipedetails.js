import "../styles/recipedetails.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import { fetchWithAuth } from "../components/api";

function RecipeDetails() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadData = async () => {

        try {
            const recipeResponse = await fetchWithAuth(
                `http://192.168.1.69:8000/api/recipes/${id}/`
            );
            const recipeData = await recipeResponse.json();
            setRecipe(recipeData);
            const foodResponse = await fetchWithAuth(
                "http://192.168.1.69:8000/api/fooditems/"
            );
            const foodData = await foodResponse.json();
            setFoods(Array.isArray(foodData)
                ? foodData
                : foodData.results);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    loadData();
    }, [id]);

    if (loading) {

        return <h2>Loading...</h2>;

    }

    const inventory = foods.map(food =>
        food.name.toLowerCase()
    );

   let ingredients = [];

if (Array.isArray(recipe.ingredients)) {
    ingredients = recipe.ingredients.map(item => String(item).trim());
}

else if (typeof recipe.ingredients === "string") {

    try {

        // Try parsing JSON first
        const parsed = JSON.parse(recipe.ingredients);

        if (Array.isArray(parsed)) {
            ingredients = parsed.map(item => String(item).trim());
        } else {
            ingredients = recipe.ingredients
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);
        }

    } catch {

        ingredients = recipe.ingredients
            .replace(/[[\]"]/g, "")
            .replace(/'/g, "")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    }

}

else if (recipe.ingredients) {

    ingredients = Object.values(recipe.ingredients)
        .map(item => String(item).trim());

}

    const available = ingredients.filter(item =>
        inventory.includes(item.toLowerCase())
    );

    const missing = ingredients.filter(item =>
        !inventory.includes(item.toLowerCase())
    );

    const percentage =
    ingredients.length > 0
        ? Math.round((available.length / ingredients.length) * 100)
        : 0;

    return (

        <div className="recipe-page">

            <div className="recipe-header">

                <FiArrowLeft

                    className="recipe-back-icon"

                    onClick={() => navigate("/meals")}

                />

                <h2>Recipe Details</h2>

            </div>

            {recipe.image &&

                <img

                    src={recipe.image}

                    alt={recipe.name}

                    className="recipe-image"

                />

            }

            <div className="recipe-body">

                <h1>{recipe.name}</h1>

                <div className="recipe-info">

                    <span>{recipe.category}</span>

                    <span>{recipe.cooking_time} mins</span>

                    <span>{recipe.servings} servings</span>

                </div>

                <div className="match-box">

                    <h3>Match Score</h3>

                    <div className="progress">

                        <div

                            className="progress-fill"

                            style={{
                                width: `${percentage}%`
                            }}

                        ></div>

                    </div>

                    <strong>{percentage}%</strong>

                </div>

                <div className="ingredient-section">

                    <h3>Available Ingredients</h3>

                    <ul>

                        {available.map(item => (

                            <li key={item}>
                                ✅ {item}
                            </li>

                        ))}

                    </ul>

                </div>

                <div className="ingredient-section">

                    <h3>Missing Ingredients</h3>

                    <ul>

                        {missing.map(item => (

                            <li key={item}>
                                ❌ {item}
                            </li>

                        ))}

                    </ul>

                </div>

                <div className="instructions">

                    <h3>Instructions</h3>

                    <p>{recipe.instructions}</p>

                </div>

                <div className="waste-card">

                    <h3>Food Waste Impact</h3>

                    <p>

                        This recipe uses

                        <strong> {available.length} </strong>

                        ingredients already in your inventory.

                    </p>

                    <p>

                        Cooking this meal helps reduce food waste.

                    </p>

                </div>

            </div>

        </div>

    );

}

export default RecipeDetails;