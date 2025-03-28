import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true); // Declare state for animation

  useEffect(() => {
    const timer = setTimeout(() => setFirstLoad(false), 500); // Remove animation after 0.5s
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const slides = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/31095885/pexels-photo-31095885/free-photo-of-vintage-styled-female-portrait-with-pampas-grass.jpeg",
      text: "Discover the Latest Fashion Trends",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/17032068/pexels-photo-17032068/free-photo-of-woman-in-a-black-dress.jpeg",
      text: "Shop the best dresses for any occasion",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
      text: "Find your perfect outfit today!",
    },
  ];

  const products = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    image: `/images/img${index + 1}.jpeg`,
    name: "Discover",
  }));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    adaptiveHeight: true,
  };

  return (
    <div className={`home-container ${firstLoad ? "loading" : ""}`}>
      {/* Hero Section with Slideshow */}
      <div className="hero">
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img
                src={slide.image}
                alt="Fashion Slide"
                className="slide-image"
                loading="lazy"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="slide-overlay">
                <h1>{slide.text}</h1>
                <button onClick={() => navigate("/products")}>Shop Now</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Dresses Section */}
      <h2 className="section-title">Featured Dresses</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
