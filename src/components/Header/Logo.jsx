import React from "react";
import { GiFlowerStar } from "react-icons/gi";
import { RiSparklingFill } from "react-icons/ri";

const Logo = () => {
  return (
    <div className="relative inline-flex items-center group cursor-pointer">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 via-purple-300/30 to-pink-200/30 blur-md opacity-100 transition-opacity duration-500 rounded-full" />

      {/* Logo content */}
      <div className="relative flex items-center gap-0.5">
        {/* Flower icon */}
        <GiFlowerStar className="w-4 h-4 text-pink-400/80 transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />

        {/* Logo text */}
        <div className="flex items-center">
          {/* Enhanced Clin text with shadow layers */}
          <div className="relative">
            <span className="absolute -left-[2px] -top-[2px] font-serif italic text-xl lg:text-4xl font-black text-pink-200/50">
              Clin
            </span>
            <span className="absolute -left-[1px] -top-[1px] font-serif italic text-xl lg:text-4xl font-black text-pink-300/50">
              Clin
            </span>
            <span className="relative font-serif italic text-xl lg:text-4xl font-black bg-gradient-to-br from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent [text-shadow:2px_2px_8px_rgba(236,72,153,0.3)]">
              Clin
            </span>
          </div>

          <RiSparklingFill className="w-4 h-4 text-purple-400/80 mx-0.5 animate-pulse" />

          {/* Enhanced Skin text with shadow layers */}
          <div className="relative">
            <span className="absolute -left-[2px] -top-[2px] font-serif italic text-xl lg:text-4xl font-black text-purple-200/50">
              Skin
            </span>
            <span className="absolute -left-[1px] -top-[1px] font-serif italic text-xl lg:text-4xl font-black text-purple-300/50">
              Skin
            </span>
            <span className="relative font-serif italic text-xl lg:text-4xl font-black bg-gradient-to-br from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent [text-shadow:2px_2px_8px_rgba(192,132,252,0.3)]">
              Skin
            </span>
          </div>
        </div>

        {/* Flower icon */}
        <GiFlowerStar className="w-4 h-4 text-purple-400/80 transform rotate-45 group-hover:rotate-0 transition-all duration-500" />
      </div>
    </div>
  );
};

export default Logo;