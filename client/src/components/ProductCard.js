import React, { useContext, useEffect, useState } from 'react';
import '../styles/productCard.css';
import { FaShoppingCart } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';


const ProductCard = ({ onClick, item, cartData }) => {

  const theme = useContext(DarkModeContext)
  const [colour, setNewColour] = useState((theme === "Light") ? 'white' : "black")
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  useEffect(() => {
    if (colour !== "red") {
      setNewColour((theme === "Light") ? 'white' : "black")
    }
  }, [theme])

  useEffect(() => {
    if (cartData.includes(item._id)) {
      setNewColour("red")
    }
  }, [])

  async function handleOnClick(event) {
    event.stopPropagation();
    const iconColour = (theme === "Light") ? 'white' : "black"
    if (token) {
      setNewColour(colour === iconColour ? "red" : iconColour)
      if (colour === iconColour) {
        try {
          const response = await fetch(`http://localhost:4000/api/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({ productId: item._id }),
          });
          if (response.status == 200) {
            const data = await response.json();
            alert(data.message)
          }
          else if (response.status == 404) {
            const errorData = await response.json();
            alert(errorData.error);
          }
          else if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            alert("Invalid token")
            navigate("/login")
          }
        }
        catch (error) {
          console.log('Error:', error);
        }
      }
      else {
        try {
          const response = await fetch(`http://localhost:4000/api/cart/remove`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({ productId: item._id }),
          });
          if (response.status == 200) {
            const data = await response.json();
            alert(data.message)
          }
          else if (response.status == 404) {
            const errorData = await response.json();
            alert(errorData.message);
          }
          else if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            alert("Invalid token")
            navigate("/login")
          }
        }
        catch (error) {
          console.log('Error:', error);
        }

      }
    }

    else {
      alert("Sign in to add to cart");
      navigate('/login')
    }
  }

  let mainColour, cardColour, textColour, ratingColour;
  if (theme === "Light") {
    mainColour = { backgroundColor: "black", color: "white" }
    cardColour = { backgroundColor: " rgba(48, 45, 48, 0.938)", boxShadow: "0px 0px 4px 4px rgba(192, 192, 192, 0.3)" }
    ratingColour = { backgroundColor: "#2a472f" }
    // textColour={color:"white"}
  }
  return (
    <div onClick={onClick} className="product-card" style={cardColour}>
      <div className="product-image-container">
        <img src={item.image} alt="Product" className="product-image" />
        <div className="product-rating" style={ratingColour}>{item.rating} <span role="img" aria-label="star">⭐</span></div>
      </div>
      <div className="product-details">
        <div className="product-name">{item.name}</div>
        <div className="product-category">{item.category}</div>
        <div className='product-price-container'>
          <div className="product-price">${item.price}</div>
          <p className="add-to-cart" onClick={handleOnClick}><FaShoppingCart style={{ color: colour }} /></p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
