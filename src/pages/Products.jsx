import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { getItem, setItem } from "../utils/storage";

const Products = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const observerRef = useRef();
  const loadBatchSize = 8;

  const allTags = [...new Set(products.flatMap((p) => p.tags || []))];

  useEffect(() => {
    setError(null);
    setLoading(true);
    const cacheKey = categoryName ? `category_${categoryName}` : "products_all";
    const cachedData = getItem(cacheKey);

    if (cachedData) {
      setProducts(cachedData);
      setLoading(false);
    }

    axios
      .get(categoryName ? `/api/products/category/${categoryName}` : "/api/products")
      .then((res) => {
        if (res.data.length === 0) {
          setError("No products found in this category");
        } else {
          setProducts(res.data);
          setItem(cacheKey, res.data);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch products");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  const getFiltered = useCallback(() => {
    let updated = [...products];

    // Apply price filter
    if (priceFilter === "below500") updated = updated.filter(p => p.price < 500);
    else if (priceFilter === "500to1000") updated = updated.filter(p => p.price >= 500 && p.price <= 1000);
    else if (priceFilter === "above1000") updated = updated.filter(p => p.price > 1000);

    // Apply rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      updated = updated.filter(p => Math.floor(p.rating || 0) >= minRating);
    }

    // In-stock only
    if (inStockOnly) updated = updated.filter(p => p.countInStock > 0);

    // Tags
    if (selectedTags.length > 0) {
      updated = updated.filter(p => (p.tags || []).some(tag => selectedTags.includes(tag)));
    }

    // Sorting
    if (sortBy === "priceLowHigh") updated.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow") updated.sort((a, b) => b.price - a.price);
    else if (sortBy === "nameAZ") updated.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "nameZA") updated.sort((a, b) => b.name.localeCompare(a.name));

    return updated;
  }, [products, priceFilter, ratingFilter, inStockOnly, selectedTags, sortBy]);

  const loadMore = useCallback(() => {
    const filtered = getFiltered();
    const next = filtered.slice(displayedProducts.length, displayedProducts.length + loadBatchSize);
    setDisplayedProducts((prev) => [...prev, ...next]);
    if (displayedProducts.length + next.length >= filtered.length) {
      setHasMore(false);
    }
  }, [getFiltered, displayedProducts.length]);

  useEffect(() => {
    const filtered = getFiltered();
    setDisplayedProducts(filtered.slice(0, loadBatchSize));
    setHasMore(filtered.length > loadBatchSize);
  }, [getFiltered]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSortBy("default");
    setPriceFilter("all");
    setRatingFilter("all");
    setInStockOnly(false);
    setSelectedTags([]);
  };

  // Real-time SSE stock updates
  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/api/products/sse/stock-updates`);

    eventSource.onmessage = (event) => {
      if (event.data && event.data.startsWith("{")) {
        try {
          const stockUpdate = JSON.parse(event.data);

          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === stockUpdate._id
                ? { ...product, countInStock: stockUpdate.countInStock }
                : product
            )
          );

          setDisplayedProducts((prev) =>
            prev.map((product) =>
              product._id === stockUpdate._id
                ? { ...product, countInStock: stockUpdate.countInStock }
                : product
            )
          );
        } catch (error) {
          console.error("Error parsing stock update:", error);
        }
      } else {
        console.log("Non-JSON SSE message:", event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setError("Failed to receive live stock updates.");
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6">
        {categoryName ? categoryName.toUpperCase() : "All Products"}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded p-2">
          <option value="default">Sort by</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="nameAZ">Name: A-Z</option>
          <option value="nameZA">Name: Z-A</option>
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="border rounded p-2">
          <option value="all">All Prices</option>
          <option value="below500">Below ₹500</option>
          <option value="500to1000">₹500 - ₹1000</option>
          <option value="above1000">Above ₹1000</option>
        </select>

        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="border rounded p-2">
          <option value="all">All Ratings</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
          <option value="1">1 star & up</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          In Stock Only
        </label>

        <button
          onClick={clearFilters}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-lg">Loading Products...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-gray-500 text-center">No products match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product, idx) => {
            const isLast = idx === displayedProducts.length - 1;
            return (
              <div
                key={product._id}
                ref={isLast ? lastProductRef : null}
                className={`p-4 rounded-lg bg-white cursor-pointer shadow transition transform hover:-translate-y-1 hover:scale-105 duration-300 ${
                  product.countInStock === 0 ? "opacity-60 pointer-events-none" : ""
                }`}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images?.[0] || "/assets/search.jpeg"}
                  alt={product.name}
                  className="w-full h-80 object-cover mb-4 pointer-events-none rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-black">₹{product.price}</p>
                <p
                  className={`text-sm font-medium ${
                    product.countInStock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
