import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      axios
        .get(`https://sensible-backend.up.railway.app/api/products/search?query=${query}`)
        .then((response) => {
          setProducts(response.data);
          setError(null);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Error fetching products");
          setProducts([]);
        });
    }
  }, [query]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const addToCart = async (product) => {
    try {
      const quantity = quantities[product._id] || 1;
      const response = await axios.post("/api/cart/add", {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
      });

      if (response.status === 201) {
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error("Failed to add item to cart!");
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart!");
    }
  };

  return (
    <div className="search-results-container">
      <ToastContainer position="top-right" autoClose={100} hideProgressBar />
      <h2>Search Results for "{query}"</h2>
      {error ? (
        <p>{error}</p>
      ) : products.length > 0 ? (
        <div className="search-results-grid">
        {products.map((product) => (
          <div key={product._id} className="search-product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="search-product-details">{product.description}</p>
            <p className="search-product-price">Price: ₹{product.price}</p>
            <div className="search-quantity-controls">
              <button onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) - 1)}>
                -
              </button>
              <input
                type="number"
                value={quantities[product._id] || 1}
                onChange={(e) => handleQuantityChange(product._id, Math.max(1, parseInt(e.target.value)))}
                min="1"
              />
              <button onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) + 1)}>
                +
              </button>
            </div>
            <button className="search-add-to-cart" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default SearchResults;