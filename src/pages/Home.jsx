import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setTimeout(() => setFade(false), 500);
  }, []);

  const slides = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/31095885/pexels-photo-31095885/free-photo-of-vintage-styled-female-portrait-with-pampas-grass.jpeg",
      text: "Timeless Elegance Awaits You",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/17032068/pexels-photo-17032068/free-photo-of-woman-in-a-black-dress.jpeg",
      text: "Grace & Glamour in Every Dress",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
      text: "Find Your Perfect Vintage Look",
    },
  ];

  const products = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    image: `/images/img${index + 1}.jpeg`,
    name: "Classic Collection",
  }));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  return (
    <div
      className={`min-h-screen mt-2 ml-1 bg-white text-[#3e2723] ${
        fade ? "opacity-0" : "opacity-100 transition-opacity duration-500"
      }`}
    >
      {/* Hero Section with Slideshow */}
      <div className="relative w-full h-[500px] flex items-center justify-center bg-white">
        <Slider {...sliderSettings} className="w-full h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative w-full h-[500px]">
              <img
                src={slide.image}
                alt="Fashion Slide"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent text-white">
                <h1 className="text-4xl font-semibold mb-4 bg-black/50 px-4 py-2 rounded">
                  {slide.text}
                </h1>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 bg-[#d36613] hover:bg-[#d37714] transition text-white rounded-lg"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Dresses Section */}
      <h2 className="text-center text-3xl font-semibold mt-10 mb-6">
        Featured Dresses
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-10 mb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-medium text-lg">{product.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
