import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/lottie/animation.json'; // Adjust the path if necessary

const LottieComponent = () => {
  const defaultOptions = {
    loop: true,          // The animation will loop indefinitely
    autoplay: true,      // The animation will start automatically
    animationData: animationData, // Imported animation JSON
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // This ensures the animation is responsive
    },
  };

  return (
    <div className="flex justify-center items-center">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LottieComponent;
