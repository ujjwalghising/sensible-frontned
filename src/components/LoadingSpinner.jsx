
// src/components/LoadingSpinner.tsx
import React from "react";
import Lottie from "react-lottie";
import animationData from "/assets/lottie/animation.json"

const LoadingSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

 // Inside LoadingSpinner.jsx
return (
  <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
    <Lottie options={defaultOptions} height={100} width={100} />
  </div>
);

};

export default LoadingSpinner;
