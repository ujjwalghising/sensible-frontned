import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      axios
        .get(`/api/products/search?query=${query}`)
        .then((response) => {
          setProducts(response.data);
          setError(null);
        })
        .catch(() => {
          setError("Failed to load search results.");
          setProducts([]);
        });
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {error ? (
        <div className="text-red-500">
          <p>{error}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 rounded-lg bg-white cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image || "/assets/search.jpeg"}
                alt={product.name}
                className="w-full h-80 object-cover mb-4 pointer-events-none"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-lg font-bold text-black">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
