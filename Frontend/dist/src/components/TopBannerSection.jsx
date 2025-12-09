// src/components/TopBannerSection.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "../Redux/bannerSlice";

// Optional fallback banners if backend gives empty array
import fallback1 from "../assets/images/Banner/mensBanner.jpg";
import fallback2 from "../assets/images/Banner/banner2.jpg";
import fallback3 from "../assets/images/Banner/banner3.jpg";

const TopBannerSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  // Redux banner data
  const banners = useSelector((state) => state.banners.data || []);

  // If backend gives empty banners → use fallback static banners
  const carouselImages =
    banners?.length > 0
      ? banners.map((banner) => ({ id: banner.id, src: banner.image }))
      : [
          { id: 1, src: fallback1 },
          { id: 2, src: fallback2 },
          { id: 3, src: fallback3 },
        ];

  // Fetch banners on load
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div
      className="top-banner"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        aspectRatio: "16 / 5",
      }}
    >
      {/* Auto Carousel */}
      <AnimatePresence mode="wait">
        <motion.img
          key={carouselImages[index].id}
          src={carouselImages[index].src}
          alt="Top Banner"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            objectPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* CTA Button */}
      <Button
        onClick={() => navigate("/products")}
        className="banner-button"
      >
        Shop Now
      </Button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "4%",
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
              backgroundColor: i === index ? "#fff" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          ></div>
        ))}
      </div>

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "20%",
          background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default TopBannerSection;
