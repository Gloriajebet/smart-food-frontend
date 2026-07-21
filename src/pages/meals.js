import "../styles/meals.css";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";

import { 
  FiMenu,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { fetchWithAuth } from "../components/api";

function MealSuggestion() {
  const navigate = useNavigate();

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([loadFoods(), loadRecipes()]);
        setLoading(false);
      };
      loadData();
    }, []);

    const loadFoods = async () => {
        try {
            const response = await fetchWithAuth(
                "https://smart-food-dyp3.onrender.com/api/fooditems/"
            );
            const data = await response.json();
            setFoods(Array.isArray(data) ? data : data.results);
            console.log("Foods from API:", data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const loadRecipes = async () => {
      try {
            const response = await fetchWithAuth(
                "https://smart-food-dyp3.onrender.com/api/recipes/"
            );
            const data = await response.json();
            console.log(data.results[0]);
            setRecipes(Array.isArray(data) ? data : data.results);
        }
        catch (error) {
            console.error(error);
        }
    };

  const today = new Date();

const suggestions = recipes
.map((recipe) => {

    let ingredients = [];

    if (Array.isArray(recipe.ingredients)) {

        ingredients = recipe.ingredients;

    }

    else if (typeof recipe.ingredients === "string") {

        ingredients = recipe.ingredients
            .replace(/[[\]"]/g, "")
            .replace(/'/g, "")
            .split(",");

    }

    const ignoreWords = [
        "fresh",
        "large",
        "small",
        "medium",
        "optional",
        "chopped",
        "diced",
        "minced",
        "ground",
        "cup",
        "cups",
        "tbsp",
        "tsp",
        "tablespoon",
        "teaspoon",
        "of"
    ];

    ingredients = ingredients
        .map(item => {

            let cleaned = item
                .toLowerCase()
                .trim();

            ignoreWords.forEach(word => {

                cleaned = cleaned.replace(
                    new RegExp("\\b" + word + "\\b", "g"),
                    ""
                );

            });

            cleaned = cleaned
                .replace(/[0-9]/g, "")
                .replace(/[()]/g, "")
                .trim();

            return cleaned;

        })
        .filter(item => item !== "");

    const available = [];
    const missing = [];

    let expiryBonus = 0;

    ingredients.forEach(item => {

        const food = foods.find(f => {

            const inventoryName = f.name
                .toLowerCase()
                .trim();

            return (

                inventoryName === item ||

                inventoryName.includes(item) ||

                item.includes(inventoryName)

            );

        });

        if (food) {

            available.push(food);

            const expiry = new Date(food.expiry_date);

            const daysLeft = Math.ceil(

                (expiry - today) /

                (1000 * 60 * 60 * 24)

            );

            if (daysLeft <= 0) {

                expiryBonus += 40;

            }

            else if (daysLeft <= 2) {

                expiryBonus += 30;

            }

            else if (daysLeft <= 5) {

                expiryBonus += 20;

            }

            else if (daysLeft <= 7) {

                expiryBonus += 10;

            }

        }

        else {

            missing.push(item);

        }

    });

    const percentage =

        ingredients.length === 0

        ? 0

        : Math.round(

            (available.length /

                ingredients.length) * 100

        );

    const priorityScore =

        percentage +

        expiryBonus +

        (available.length * 5);

    return {

        ...recipe,

        ingredients,

        available,

        missing,

        percentage,

        priorityScore

    };

})

.filter(recipe => recipe.percentage >= 0)

.sort((a, b) =>

    b.priorityScore - a.priorityScore

);
 const filteredSuggestions = suggestions
.filter(recipe =>
    recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
)
.slice(0, 20);

    if (loading) {
        return <h2>Loading suggestions...</h2>;
    }

    return (
        <div className="meals-container">
           <Sidebar 
      isOpen={sidebarOpen}
      closeSidebar={() => setSidebarOpen(false)}
      />

            <div className="meals-header">
                <FiMenu
                className="header-icon"
                onClick={() => setSidebarOpen(true)}
                />

                <h2>Meal Suggestions</h2>

                <FiSearch
                className="header-icon"
                onClick={() => setShowSearch(!showSearch)}
                />

            </div>

            {showSearch && (
      <div className="floating-search">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      )}

      {filteredSuggestions.length === 0 ? (

        <div className="no-results">
        <h2>No meals found</h2>
        <p>Click the + button to add a new meal suggestion.</p>
    </div>

) : (
          
      filteredSuggestions.map(recipe => (
                <div className="meal-card"
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
          
              {recipe.image && (
                  <img 
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                  />
                )
                }
                    
                    <h3>{recipe.name}</h3>

                    <div className="match-score">
                      <span>Match Score</span>

                       <span
        className={
            recipe.percentage >= 80
                ? "excellent"
                : recipe.percentage >= 50
                ? "good"
                : "poor"
        }
    >
        {
            recipe.percentage >= 80
                ? "Excellent Match"
                : recipe.percentage >= 50
                ? "Good Match"
                : "Low Match"
        }
    </span>
                      <p>
    <strong>Category:</strong> {recipe.category}
</p>

<p>
    <strong>Cooking Time:</strong> {recipe.cooking_time} mins
</p>

<p>
    <strong>Servings:</strong> {recipe.servings}
</p>
         
                      <div className="progress">
                        <div
                          className="progress-fill"
                          style={{ width: `${recipe.percentage}%` }}
                        ></div>
                      </div>
                        <strong>
                            {recipe.percentage}%
                        </strong>
                       <p className="waste-score">

{recipe.priorityScore >= 120 && "Highest Waste Reduction Priority"}

{recipe.priorityScore >= 90 &&
 recipe.priorityScore < 120 &&
 "High Waste Reduction Priority"}

{recipe.priorityScore >= 60 &&
 recipe.priorityScore < 90 &&
 "Moderate Waste Reduction Priority"}

{recipe.priorityScore < 60 &&
 "Low Waste Reduction Priority"}

</p>

<p className="meal-view-recipe">
    Tap to view full recipe.
</p>

                    </div>
                    <h3>
                      Available Ingredients({recipe.available.length})
                    </h3>
                    <ul>
                        {recipe.available.map(food => {

    const expiryDate = new Date(food.expiry_date);

    const daysLeft = Math.ceil(

        (expiryDate - new Date()) /

        (1000 * 60 * 60 * 24)

    );

    return (

        <li key={food.id}>

            ✅ {food.name}

            {daysLeft <= 0 &&

                <span className="expiry urgent">

                    (Expired)

                </span>

            }

            {daysLeft > 0 && daysLeft <= 3 &&

                <span className="expiry warning">

                    (Expires in {daysLeft} day{daysLeft > 1 ? "s" : ""})

                </span>

            }

        </li>

    );

})}
                    </ul>
                    {recipe.missing.length > 0 && (
                        <>
                            <h3>
                              Missing Ingredients({recipe.missing.length}) 
                            </h3>
                            <ul>
                                {recipe.missing.map(item => (
                                    <li key={item}>
                                        ❌ {item}
                                    </li>
                                ))}
                            </ul>

                        </>
                    )}
                </div>
            ))
          )}
            <button
                  className="floating-btn"
                  onClick={() => navigate("/add-recipe")}
                >
                  <FiPlus />
                </button>
        </div>
    );
}

export default MealSuggestion;