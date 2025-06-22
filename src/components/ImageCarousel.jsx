import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageCarousel = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const transitionInProgress = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startInterval = () => {
    if (images.length > 1 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!transitionInProgress.current) {
          transitionInProgress.current = true;
          setCurrentImageIndex((prevIndex) => {
            const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
            setTimeout(() => {
              transitionInProgress.current = false;
            }, 300);
            return newIndex;
          });
        }
      }, 1500);
    }
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    startInterval();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    stopInterval();
    transitionInProgress.current = false;
    setTimeout(() => {
      if (!isHovering) {
        setCurrentImageIndex(0);
      }
    }, 300);
  };

  return (
    <div
      className="relative pb-[100%]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImageIndex}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-t-lg"
          src={images[currentImageIndex]?.url || images[currentImageIndex]}
          alt={`${name} - Image ${currentImageIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
        />
      </AnimatePresence>
      {isHovering && images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentImageIndex
                  ? "bg-white shadow-md"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
