import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deletedItem, setDeletedItem] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  // Fetch cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      // Ensure response data is an array
      setCartItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load cart items!');
    }
    setLoading(false);
  };

  // Remove item locally and sync with server
  const removeFromCart = (item) => {
    setDeletedItem(item);
    setCartItems((prevItems) => prevItems.filter((i) => i._id !== item._id));
    toast.info('Item removed. Click "Undo" to restore.');

    axios.delete(`/api/cart/${item._id}`).catch(() => {
      toast.error('Failed to remove item!');
      setCartItems((prevItems) => [...prevItems, item]);
    });
  };

  // Undo remove instantly
  const undoRemove = () => {
    if (deletedItem) {
      setCartItems((prevItems) => [...prevItems, deletedItem]);
      toast.success('Item restored to cart!');

      axios.post('/api/cart/add', {
        productId: deletedItem.productId,
        quantity: deletedItem.quantity,
      }).catch(() => toast.error('Failed to restore item!'));

      setDeletedItem(null);
    }
  };

  // Update quantity instantly
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    axios.put(`/api/cart/update/${id}`, { quantity: newQuantity })
      .then(() => toast.success('Item quantity updated'))
      .catch(() => toast.error('Failed to update quantity!'));
  };

  // Calculate total price with discount
  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
    return total - (total * discount) / 100;
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      axios.delete('/api/cart/clear')
        .then(() => {
          setCartItems([]); // Clear locally only after successful deletion
          toast.success('Cart cleared successfully!');
        })
        .catch(() => {
          toast.error('Failed to clear cart!');
          fetchCartItems(); // Re-fetch if server fails
        });
    }
  };

  // Checkout cart
  const handleCheckout = () => {
    setCheckingOut(true);
    axios.post('/api/cart/checkout')
      .then(() => {
        toast.success('Checkout successful!');
        setCartItems([]); // Clear cart after successful checkout
      })
      .catch(() => toast.error('Checkout failed!'))
      .finally(() => setCheckingOut(false));
  };

  // Apply discount
  const applyDiscount = () => {
    if (discountCode === 'SAVE20') {
      setDiscount(20);
      toast.success('Discount applied: 20% off!');
    } else {
      toast.error('Invalid discount code');
    }
  };

  return (
    <div className="cart-container p-4">
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />

      {loading ? (
        <div className="loading">Loading your cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center text-center">
          <img
            src="https://img.freepik.com/premium-vector/shopping-bag-sleeping-character-cartoon-mascot-vector_193274-14172.jpg"
            alt="Empty Cart"
            className="w-65 h-65 mx-auto"
          />
          <p>Hey, it feels so light!</p>
          <p>There is nothing in your bag. Let’s add some items.</p>
          <button onClick={() => window.location.href = '/products'} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center p-4 border-b">
                <img src={item.image || 'default-image.jpg'} alt={item.name} className="w-24 h-24 object-cover" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-500">Category: {item.category}</p>
                  <p className="text-gray-900">Price: ₹{item.price}</p>

                  <div className="quantity-controls mt-2 flex items-center">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-4 py-1 border rounded">-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      min="1"
                      className="mx-2 w-16 text-center border p-2"
                    />
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-4 py-1 border rounded">+</button>
                  </div>

                  <p className="mt-2 font-semibold">Total: ₹{item.price * item.quantity}</p>
                  <button className="mt-2 py-1 px-4 bg-red-500 text-white rounded" onClick={() => removeFromCart(item)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary mt-4">
            <h2 className="text-2xl font-semibold">Total Price: ₹{getTotalPrice()}</h2>

            <div className="discount-section mt-4">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button className="mt-2 py-2 px-4 bg-green-500 text-white rounded" onClick={applyDiscount}>
                Apply Discount
              </button>
            </div>

            {deletedItem && (
              <div className="undo-section mt-4 p-4 bg-gray-100">
                <p>Item removed: {deletedItem.name}</p>
                <button className="py-1 px-4 bg-yellow-500 text-white rounded" onClick={undoRemove}>
                  Undo
                </button>
              </div>
            )}

            <button className="mt-4 py-2 px-4 bg-gray-300 text-black rounded" onClick={clearCart}>
              Clear Cart
            </button>

            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
