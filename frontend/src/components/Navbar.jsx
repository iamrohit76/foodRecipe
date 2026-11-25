import { useEffect, useState } from 'react';
import Modal from './Modal';
import InputForm from './InputForm';
import { NavLink, useNavigate } from 'react-router-dom';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => getStoredUser());
  const navigate = useNavigate();

  const isLoggedOut = !token;

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setUser(getStoredUser());
    };
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header>
        <h2>Food Blog</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li onClick={() => isLoggedOut && setIsOpen(true)}>
            <NavLink to={!isLoggedOut ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>
          <li onClick={() => isLoggedOut && setIsOpen(true)}>
            <NavLink to={!isLoggedOut ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className='login'>
              {isLoggedOut ? "Login" : "Logout"}
              {!isLoggedOut && user?.email ? ` (${user.email})` : ""}
            </p>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
