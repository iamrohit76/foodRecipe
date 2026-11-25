import { useState } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import foodImg from '../assets/foodRecipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { API_URL } from '../config';

const getStoredFavs = () => {
  try {
    return JSON.parse(localStorage.getItem("fav")) || [];
  } catch {
    return [];
  }
};

export default function RecipeItems() {
  const recipes = useLoaderData();
  const [deletedIds, setDeletedIds] = useState([]);
  const [favItems, setFavItems] = useState(() => getStoredFavs());
  const location = useLocation();
  const isMyRecipePage = location.pathname === "/myRecipe";
  const navigate = useNavigate();

  const allRecipes = Array.isArray(recipes)
    ? recipes.filter((recipe) => !deletedIds.includes(recipe._id))
    : [];

  const onDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/recipe/${id}`, {
        headers: {
          authorization: "bearer " + localStorage.getItem("token")
        }
      });
      setDeletedIds((prev) => [...prev, id]);
      const filterItem = favItems.filter((recipe) => recipe._id !== id);
      setFavItems(filterItem);
      localStorage.setItem("fav", JSON.stringify(filterItem));
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const favRecipe = (e, item) => {
    e.stopPropagation();
    const exists = favItems.some((recipe) => recipe._id === item._id);
    const updatedFavs = exists
      ? favItems.filter((recipe) => recipe._id !== item._id)
      : [...favItems, item];
    setFavItems(updatedFavs);
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
  };

  return (
    <div className='card-container'>
      {allRecipes.map((item, index) => (
        <div
          key={item._id || index}
          className='card'
          onDoubleClick={() => navigate(`/recipe/${item._id}`)}
        >
          <img
            src={item.coverImage ? `${API_URL}/images/${item.coverImage}` : foodImg}
            onError={(e) => { e.currentTarget.src = foodImg; }}
            alt={item.title}
            width="120px"
            height="100px"
          />
          <div className='card-body'>
            <div className='title'>{item.title}</div>
            <div className='icons'>
              <div className='timer'><BsStopwatchFill />{item.time}</div>
              {!isMyRecipePage ? (
                <FaHeart
                  onClick={(e) => favRecipe(e, item)}
                  style={{ color: favItems.some((res) => res._id === item._id) ? "red" : "" }}
                />
              ) : (
                <div className='action'>
                  <Link
                    to={`/editRecipe/${item._id}`}
                    className="editIcon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEdit />
                  </Link>
                  <MdDelete
                    onClick={(e) => onDelete(e, item._id)}
                    className='deleteIcon'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
