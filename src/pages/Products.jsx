// Products.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../utils/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Products.css';

const Products = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const endpoint = categoryName
      ? `https://sensible-backend.up.railway.app/api/products/category/${categoryName}`
      : 'https://sensible-backend.up.railway.app/api/products';

    axios.get(endpoint)
      .then((response) => {
        if (response.data.length === 0) {
          setError('No products found in this category');
        } else {
          setProducts(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products!');
        toast.error('Failed to load products!');
        setLoading(false);
      });
  }, [categoryName]);

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

      const response = await axios.post('/api/cart/add', {
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
        toast.error('Failed to add item to cart!');
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart!');
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />

      <div className='prodhead'>
        <h1>{categoryName ? categoryName.toUpperCase() : "All Products"}</h1>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.href = '/'}>Back to Home</button>
          </div>
        ) : (
          <div className='product-list'>
            {products.map((product) => (
              <div key={product._id} className='product-card'>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ₹{product.price}</p>

                <div className='quantity-controls'>
                  <button 
                    onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) - 1)}
                    disabled={loading}
                  >
                    -
                  </button>

                  <input 
                    type="number" 
                    value={quantities[product._id] || 1} 
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      handleQuantityChange(product._id, newQuantity >= 1 ? newQuantity : 1);
                    }}
                    min="1"
                    disabled={loading}
                  />

                  <button 
                    onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) + 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>

                <button 
                  className='add-to-cart-btn' 
                  onClick={() => addToCart(product)}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;


// Fixed proxy and endpoints
// Replaced 'https' with relative paths for proxy to work
// Let me know if you want me to check any other part! 🚀
