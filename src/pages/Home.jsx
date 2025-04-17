import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useInView } from "react-intersection-observer";
import confetti from "canvas-confetti";
import Lottie from "react-lottie";
import Slider from "react-slick";
import { motion } from "framer-motion";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import animationData from "/assets/lottie/animation.json";

const Home = () => {
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [refStats, inViewStats] = useInView({ triggerOnce: true });

  const handleNewsletterSignup = async () => {
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      setError("Please enter a valid email");
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message);
  
      setSubscribed(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };
  

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const products = [
    { id: 1, name: 'Elegant Dress', price: '$59', img: '/images/img1.jpeg' },
    { id: 2, name: 'Chic Jacket', price: '$89', img: '/images/img2.jpeg' },
    { id: 3, name: 'Formal Suit', price: '$129', img: '/images/img3.jpeg' },
  ];

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-white text-zinc-800 transition-colors duration-500">

        {/* 🎥 Hero Section */}
        <div className="relative h-[600px] w-full overflow-hidden">
          <video
            src="/videos/hero-bg.mp4"
            autoPlay
            loop
            muted
            className="absolute w-full h-full object-cover"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 text-white text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Unleash Your Elegance
            </motion.h1>
            <motion.button
              onClick={() => navigate("/products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-[#e97b3b] hover:bg-[#f0821d] transition rounded-lg"
            >
              Shop Now
            </motion.button>
          </div>
        </div>

        {/* 📦 Trending Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <Parallax speed={-5}>
            <h2 className="text-3xl text-center font-semibold mb-10">Trending Categories</h2>
          </Parallax>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-10">
            {["Vintage", "Chic", "Formal", "Boho"].map((cat, i) => (
              <motion.div
                key={i}
                className="bg-orange-100 p-6 rounded-xl shadow hover:shadow-lg text-center text-lg font-medium floating-element"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: ["0px", "-15px", "0px"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                {cat}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🔢 Animated Counters */}
        <motion.div
          ref={refStats}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-20 px-4 md:px-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {["Dresses Sold", "Happy Customers", "Design Awards", "Years in Fashion"].map((label, i) => (
              <div key={i}>
                <h3 className="text-4xl font-bold">
                  {inViewStats ? Math.floor(Math.random() * 5000 + 500) : 0}+
                </h3>
                <p className="text-lg mt-2">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ✉️ Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
          <p className="mb-6">Sign up for our newsletter and never miss a drop.</p>
          {subscribed ? (
            <p className="text-green-600 font-medium">Thanks for subscribing! 🎉</p>
          ) : (
            <div className="flex justify-center gap-2 flex-col md:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="px-4 py-2 rounded-lg md:rounded-l-lg border border-gray-300 focus:outline-none"
              />
              <button
                onClick={handleNewsletterSignup}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg md:rounded-r-lg"
              >
                Subscribe
              </button>
            </div>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </motion.div>

        {/* 🎞️ Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mt-16 flex flex-col items-center justify-center gap-4"
        >
          <div className="relative">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid meet",
                },
              }}
              height={200}
              width={200}
              isStopped={false}
              isPaused={false}
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Interactive animation loaded from Lottie
          </p>
        </motion.div>

        {/* 🛍️ Featured Products Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-4 md:px-10 mt-20"
        >
          <h2 className="text-3xl font-semibold text-center mb-10">Featured Products</h2>
          <Slider {...carouselSettings}>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-item text-center transition-transform transform hover:scale-105"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="mx-auto w-60 h-70 mb-3 rounded-md shadow-md"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-lg text-orange-500">{product.price}</p>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </ParallaxProvider>
  );
};

export default Home;
