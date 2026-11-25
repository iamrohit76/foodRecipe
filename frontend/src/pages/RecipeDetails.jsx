import profileImg from '../assets/profile.png';
import food from '../assets/foodRecipe.png';
import { useLoaderData } from 'react-router-dom';
import { API_URL } from '../config';

export default function RecipeDetails() {
  const recipe = useLoaderData();

  if (!recipe) {
    return (
      <div className='outer-container'>
        <h3>Recipe not found</h3>
      </div>
    );
  }

  return (
    <div className='outer-container'>
      <div className='profile'>
        <img src={profileImg} alt="User profile" width="50px" height="50px" />
        <h5>{recipe.email || "Unknown"}</h5>
      </div>
      <h3 className='title'>{recipe.title}</h3>
      <img
        src={recipe.coverImage ? `${API_URL}/images/${recipe.coverImage}` : food}
        onError={(e) => { e.currentTarget.src = food; }}
        alt={recipe.title}
        width="220px"
        height="200px"
      />
      <div className='recipe-details'>
        <div className='ingredients'>
          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='instructions'>
          <h4>Instructions</h4>
          <span>{recipe.instructions}</span>
        </div>
      </div>
    </div>
  );
}
