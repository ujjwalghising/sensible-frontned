import { useState } from "react";

const ImageCarousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full max-w-lg mx-auto mb-4">
      <img
        src={images[current]}
        alt={`product-${current}`}
        className="w-full h-96 object-contain rounded-lg border"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
