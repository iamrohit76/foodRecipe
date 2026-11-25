import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    file: null
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const val = e.target.name === "file" ? e.target.files[0] : e.target.value;
    setRecipeData((pre) => ({ ...pre, [e.target.name]: val }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("time", recipeData.time);
    formData.append("ingredients", recipeData.ingredients);
    formData.append("instructions", recipeData.instructions);
    if (recipeData.file) {
      formData.append("file", recipeData.file);
    }

    try {
      await axios.post("http://localhost:5000/recipe", formData, {
        headers: {
          authorization: 'bearer ' + localStorage.getItem("token")
        }
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add recipe. Please make sure you are logged in.");
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input type="text" className='input' name="title" value={recipeData.title} onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Time</label>
          <input type="text" className='input' name="time" value={recipeData.time} onChange={onHandleChange} />
        </div>
        <div className='form-control'>
          <label>Ingredients</label>
          <textarea className='input-textarea' name="ingredients" rows="5" value={recipeData.ingredients} onChange={onHandleChange} required placeholder="Comma separated (e.g. Flour, Sugar, Eggs)" />
        </div>
        <div className='form-control'>
          <label>Instructions</label>
          <textarea className='input-textarea' name="instructions" rows="5" value={recipeData.instructions} onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Recipe Image</label>
          <input type="file" className='input' name="file" accept="image/*" onChange={onHandleChange} />
        </div>
        {error && <h6 className='error'>{error}</h6>}
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}
