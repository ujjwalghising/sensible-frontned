import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

Modal.setAppElement('#root');

const ProductDetails = () => {
  const { id } = useParams();
const { user } = useAuth();


  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false); // For wishlist functionality
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error('Failed to load product');
    }
  };

  useEffect(() => {
    fetchProduct();

    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/sse/stock-updates`
    );

    eventSource.onmessage = (e) => {
      const updatedProduct = JSON.parse(e.data);
      if (updatedProduct.productId === id) {
        setProduct((prevProduct) =>
          prevProduct
            ? { ...prevProduct, countInStock: updatedProduct.stock }
            : prevProduct
        );
      }
    };

    eventSource.onerror = (e) => {
      console.error('Error with SSE connection:', e);
      toast.error('Error with stock updates.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

const handleQuantityChange = (value) => {
  if (value < 1 || value > product.countInStock) {
    toast.error('Invalid quantity');
    return;
  }
  setQuantity(value);
  setInputValue(value.toString());
};
const addToCart = async () => {
  if (!product || product.countInStock < 1) {
    toast.error('Out of stock');
    return;
  }

  try {
    const res = await axios.post('/api/cart/add', {
      productId: product._id,
      quantity,
    });

    if (res.status === 201) {
      toast.success('Added to cart');
    } else {
      toast.error('Failed to add to cart');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to add');
  }
};
  const submitReview = async () => {
    if (!comment.trim()) return toast.error('Please enter a comment');

    try {
      setSubmittingReview(true);
      await axios.post(
        `/api/products/${id}/review`,
        {
          comment,
          rating,
        },
        { withCredentials: true }
      );

      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      fetchProduct(); // Refresh product + reviews
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Wishlist functionality
  const toggleWishlist = async () => {
    try {
      const res = await axios.post(
        `/api/products/${id}/wishlist`,
        {},
        { withCredentials: true }
      );

      setIsWishlist(!isWishlist);
      toast.success(isWishlist ? 'Removed from Wishlist' : 'Added to Wishlist');
    } catch (err) {
      toast.error('Error with Wishlist');
    }
  };

  if (!product) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 md:p-8 mt-6">
      <ToastContainer position="top-right" autoClose={500} hideProgressBar />

      <div className="flex flex-col lg:flex-row gap-22">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div
            className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={product.images?.[activeImage]}
              alt={`Product ${activeImage + 1}`}
              className="w-full h-full object-cover transition-all duration-300 transform hover:scale-105"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImage(idx)}
                className={`w-full h-40 object-cover rounded-md transition-all duration-300 cursor-pointer ${
                  idx === activeImage
                    ? 'border-2 border-blue-600 shadow-md'
                    : 'border border-gray-200'
                }`}
                alt={`Thumbnail ${idx}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-yellow-500 text-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.round(product.rating || 0) ? '★' : '☆'}
              </span>
            ))}
            <span className="text-gray-600 text-sm ml-1">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <p className="text-gray-600 text-base">{product.description}</p>

          <div className="text-2xl font-semibold text-green-600">
            ₹{product.price}
          </div>

          <div className="text-sm text-gray-500">Category: {product.category}</div>

          <div className="flex items-center gap-3">
  <span className="text-sm font-medium">Quantity:</span>
  <button
    onClick={() => handleQuantityChange(quantity - 1)}
    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
    disabled={quantity === 1}
  >
    -
  </button>
<input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onBlur={() => {
    const parsed = parseInt(inputValue);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= product.countInStock) {
      setQuantity(parsed);
    } else {
      toast.error('Invalid quantity');
      setInputValue(quantity.toString());
    }
  }}
  className="w-14 text-center border border-gray-300 rounded-lg"
/>
  <button
    onClick={() => handleQuantityChange(quantity + 1)}
    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
    disabled={quantity >= product.countInStock}
  >
    +
  </button>
</div>


          {/* Add to Cart Button */}
          {product?.countInStock > 0 ? (
            <button
              onClick={addToCart}
              disabled={isAdding}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 mt-4"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium disabled:opacity-50 mt-4"
            >
              Out of Stock
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition-all mt-4"
          >
            {isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Review Form */}
          {user && (
            <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
              <div className="flex items-center mb-4">
                <select
                  className="border border-gray-300 rounded-md px-3 py-1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} Stars
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={submitReview}
                disabled={submittingReview}
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Product Image Modal"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg"
      >
        <img
          src={product.images?.[activeImage]}
          alt={`Product ${activeImage + 1}`}
          className="w-full h-full object-cover"
        />
      </Modal>
    </div>
  );
};

export default ProductDetails;
