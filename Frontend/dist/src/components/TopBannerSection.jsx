// src/components/TopBannerSection.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import mensBanner from "../assets/images/Banner/mensBanner.jpg";
import banner2 from "../assets/images/Banner/banner2.jpg";
import banner3 from "../assets/images/Banner/banner3.jpg";
import main from "../assets/images/Banner/main.jpg";

const carouselImages = [
  { id: 1, src: mensBanner, caption: "Trendy Men's Fashion" },
  { id: 2, src: banner2, caption: "Upgrade Your Wardrobe" },
  { id: 3, src: banner3, caption: "Shop the Best Styles" },
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
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "30px",
        flexWrap: "wrap",
      }}
    >
      {/* 🌀 Left Auto Carousel */}
      <div
        style={{
          flex: 1,
          maxWidth: "50%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          height: "500px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={carouselImages[index].id}
            src={carouselImages[index].src}
            alt={carouselImages[index].caption}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </AnimatePresence>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "8px 12px",
            borderRadius: "5px",
          }}
        >
          {carouselImages[index].caption}
        </div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "20px",
            display: "flex",
            gap: "5px",
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
                backgroundColor: i === index ? "white" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 🛍️ Right Static Banner */}
      <div
        style={{
          flex: 1,
          maxWidth: "50%",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          height: "500px",
        }}
      >
        <img
          src={main}
          alt="Shop Now Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "20px",
            color: "white",
          }}
        >
         <Button
  onClick={() => navigate("/products")}
  style={{
    marginTop: "327px",
    marginLeft:"651px",
    fontWeight: "600",
    width: "258px",
    height: "65px",
    border: "none",
    borderRadius: "20px",
    background: "linear-gradient(90deg, #141312ff, #474443ff)", // 🔥 Gradient color
    color: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.4)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
  }}
>
  Shop Now
</Button>

        </div>
      </div>
    </div>
  );
};

export default TopBannerSection;
