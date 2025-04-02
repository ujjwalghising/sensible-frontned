import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(() => {
    const cachedProduct = localStorage.getItem(`product_${id}`);
    return cachedProduct ? JSON.parse(cachedProduct) : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!product) {
      axios.get(`/api/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          localStorage.setItem(`product_${id}`, JSON.stringify(response.data)); // Cache data
        })
        .catch(() => setError('Failed to load product details!'));
    }
  }, [id, product]);

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const addToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      const response = await axios.post('/api/cart/add', {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
      });

      response.status === 201
        ? toast.success(`${product.name} added to cart!`)
        : toast.error('Failed to add item to cart!');
    } catch {
      toast.error('Failed to add item to cart!');
    }
    setIsAdding(false);
  };

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row items-center gap-6 mt-6">
      <ToastContainer position="top-right" autoClose={500} hideProgressBar />

      <img 
        src={product?.image || '/assets/no-image.jpg'} 
        alt={product?.name} 
        className="w-full h-120 md:w-1/2 object-cover rounded-lg shadow-md" 
      />

      <div className="md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">{product?.name}</h1>
        <p className="text-gray-600">{product?.description}</p>
        <p className="text-xl font-semibold">Price: ₹{product?.price}</p>
        <p className="text-gray-700">Size: {product?.size || 'Standard'}</p>
        <p className="text-gray-700">Fit: {product?.fit || 'Regular'}</p>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)} 
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            disabled={quantity === 1}
          >-</button>

          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-12 text-center border rounded"
          />

          <button 
            onClick={() => handleQuantityChange(quantity + 1)} 
            className="px-3 py-1 bg-gray-300 rounded"
          >+</button>
        </div>

        <button 
          className="mt-4 bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          onClick={addToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
