import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    file: null
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipe/${id}`);
        const res = response.data;
        setRecipeData({
          title: res.title || "",
          ingredients: Array.isArray(res.ingredients) ? res.ingredients.join(",") : (res.ingredients || ""),
          instructions: res.instructions || "",
          time: res.time || "",
          file: null
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recipe");
      }
    };
    getData();
  }, [id]);

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
      await axios.put(`${API_URL}/recipe/${id}`, formData, {
        headers: {
          authorization: 'bearer ' + localStorage.getItem("token")
        }
      });
      navigate("/myRecipe");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update recipe");
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title} required />
        </div>
        <div className='form-control'>
          <label>Time</label>
          <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time} />
        </div>
        <div className='form-control'>
          <label>Ingredients</label>
          <textarea className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients} required />
        </div>
        <div className='form-control'>
          <label>Instructions</label>
          <textarea className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions} required />
        </div>
        <div className='form-control'>
          <label>Recipe Image</label>
          <input type="file" className='input' name="file" accept="image/*" onChange={onHandleChange} />
        </div>
        {error && <h6 className='error'>{error}</h6>}
        <button type="submit">Edit Recipe</button>
      </form>
    </div>
  );
}
