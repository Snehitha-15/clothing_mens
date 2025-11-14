// src/components/TopBannerSection.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import mensBanner from "../assets/images/Banner/mensBanner.jpg";
import banner2 from "../assets/images/Banner/banner2.jpg";
import banner3 from "../assets/images/Banner/banner3.jpg";

const carouselImages = [
  { id: 1, src: mensBanner },
  { id: 2, src: banner2 },
  { id: 3, src: banner3 },
];

const TopBannerSection = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="top-banner"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        aspectRatio: "16 / 5", 
        borderRadius: "0px",
      }}
    >
      {/* 🌀 Full-width Auto Carousel */}
      <AnimatePresence mode="wait">
        <motion.img
          key={carouselImages[index].id}
          src={carouselImages[index].src}
          alt="Men's Fashion Banner"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill", // ensures full image is visible
            objectPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* 🛍️ Shop Now Button */}
      <Button
        onClick={() => navigate("/products")}
        className="banner-button"
        // onMouseEnter={(e) => {
        //   e.target.style.transform = "scale(1.05)";
        //   e.target.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.4)";
        // }}
        // onMouseLeave={(e) => {
        //   e.target.style.transform = "scale(1)";
        //   e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
        // }}
      >
        Shop Now
      </Button>

      {/* ⚫ Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {carouselImages.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          ></div>
        ))}
      </div>

      {/* 🌈 Optional Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "20%",
          background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default TopBannerSection;
