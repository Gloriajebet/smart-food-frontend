import { useState, useEffect } from "react";

function FoodForm({ initialValues, onSubmit, buttonText }) {

    const [food, setFood] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        expiry_date: ""
    });

    useEffect(() => {
        if (initialValues) {
            setFood(initialValues);
        }
    }, [initialValues]);
    const handleChange = (e) => {
        setFood({
            ...food,
            [e.target.name]: e.target.value
        });
    };
    const submit = (e) => {
        e.preventDefault();
        onSubmit(food);
    };

    return (
        <form onSubmit={submit}>

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

            <label>Expiry Date</label>

            <input
                type="date"
                name="expiry_date"
                value={food.expiry_date}
                onChange={handleChange}
                required
            />

            <button type="submit">
                {buttonText}
            </button>
        </form>
    );
}

export default FoodForm;