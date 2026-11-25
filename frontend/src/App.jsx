import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';

const getAllRecipes = async () => {
  try {
    const res = await axios.get('https://foodrecipe-435j.onrender.com/recipe');
    return res.data;
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    return [];
  }
};

const getMyRecipes = async () => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    if (!user?._id) return [];
    const allRecipes = await getAllRecipes();
    return allRecipes.filter((item) => item.createdBy === user._id);
  } catch {
    return [];
  }
};

const getFavRecipes = () => {
  try {
    return JSON.parse(localStorage.getItem("fav")) ?? [];
  } catch {
    return [];
  }
};

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`https://foodrecipe-435j.onrender.com/recipe/${params.id}`);
    let recipe = recipeRes.data;
    if (recipe?.createdBy) {
      try {
        const userRes = await axios.get(`https://foodrecipe-435j.onrender.com/user/${recipe.createdBy}`);
        recipe = { ...recipe, email: userRes.data.email };
      } catch {
        recipe = { ...recipe, email: "Unknown" };
      }
    }
    return recipe;
  } catch (err) {
    console.error("Failed to fetch recipe:", err);
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
