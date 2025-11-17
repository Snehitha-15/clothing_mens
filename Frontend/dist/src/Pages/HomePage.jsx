// src/pages/HomePage.jsx
import React from "react";
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, Button } from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TopBannerSection from "../components/TopBannerSection";
import "./HomePage.css";

// 🖼️ Product images
import shirt1 from "../assets/images/shirts/shirt1.jpg";
import shirt10 from "../assets/images/shirts/shirt10.jpg";
import blazer17 from "../assets/images/Blazer/blazer17.jpg";
import blazer18 from "../assets/images/Blazer/blazer18.jpg";
import suit3 from "../assets/images/suits/suit3.jpg";
import blazer4 from "../assets/images/Blazer/blazer4.jpg";

// Special Product Images
import shirt15 from "../assets/images/shirts/shirt15.jpg";
import shirt18 from "../assets/images/shirts/shirt18.jpg";
import blazer10 from "../assets/images/Blazer/blazer17.jpg";
import blazer8 from "../assets/images/Blazer/blazer18.jpg";
import shirt2 from "../assets/images/shirts/shirt2.jpg";
import blazer14 from "../assets/images/Blazer/blazer14.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const newProducts = [
    { id: 1, name: "Grey Sweatshirt", price: 1099, image: blazer18 },
    { id: 2, name: "Formal Blazer", price: 2199, image: blazer17 },
    { id: 3, name: "Trendy Jacket", price: 1999, image: shirt10 },
    { id: 4, name: "Casual Shirt", price: 1199, image: shirt1 },
    { id: 5, name: "Slim Fit Suit", price: 2599, image: suit3 },
    { id: 6, name: "Stylish Blazer", price: 699, image: blazer4 },
  ];

  const specialProducts = [
    { id: 101, name: "Soft Wool Sweater", price: 1499, image: shirt15 },
    { id: 102, name: "Slim Fit Suit", price: 2599, image: blazer10 },
    { id: 103, name: "Stylish Shirt", price: 999, image: shirt18 },
    { id: 104, name: "Modern Jacket", price: 1899, image: blazer8 },
    { id: 105, name: "Formal Blazer", price: 2199, image: shirt2 },
    { id: 106, name: "Blazer", price: 2199, image: blazer14 },
  ];

  const bottomBanners = [
    { id: 1, title: "COATS & JACKETS", image: shirt10, category: "jackets" },
    { id: 2, title: "SPORTS JACKETS", image: blazer18, category: "sports" },
    { id: 3, title: "SUITS & BLAZERS", image: blazer17, category: "blazer" },
  ];

  // 🔥 Reusable Horizontal Scroll Section
  const ProductSliderSection = ({ title, products, seeAllLink }) => (
    <Card className="big-card mb-4 p-3" style={{ borderRadius: "16px" }}>
      <div className="d-flex justify-content-between align-items-center mb-2 px-2">
        <h4 className="section-title m-0">{title}</h4>

        <p
          className="see-all-text"
          onClick={() => navigate(seeAllLink)}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >
          See All →
        </p>
      </div>

      {/* Horizontal Scroll Row */}
      <div className="horizontal-scroll">
        {products.map((item) => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }} className="scroll-card">
            <Card className="product-card" onClick={() => navigate(`/products/${item.id}`)}>
              <CardImg src={item.image} alt={item.name} className="product-image" />
              <CardBody className="text-center">
                <CardTitle tag="h6">{item.name}</CardTitle>
                <p className="text-muted">₹{item.price}</p>
                <Button color="dark" size="sm">
                  Add to Cart
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="homepage">
      {/* Top Banner */}
      <TopBannerSection />

      <Container fluid className="mt-4 px-3">
        
        {/* New Products */}
        <ProductSliderSection 
          title="New Products"
          products={newProducts}
          seeAllLink="/products/new"
        />

        {/* Special Products */}
        <ProductSliderSection 
          title="Special Products"
          products={specialProducts}
          seeAllLink="/products/special"
        />

        {/* Bottom Banners */}
        <div className="bottom-banner-section mt-5">
          {bottomBanners.map((banner) => (
            <motion.div
              key={banner.id}
              className="bottom-banner"
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/products/${banner.category}`)}
            >
              <img src={banner.image} alt={banner.title} />
              <div className="banner-overlay">
                <h4>{banner.title}</h4>
                <p>Explore our selection of premium Collection for men</p>
              </div>
            </motion.div>
          ))}
        </div>

      </Container>
    </div>
  );
};

export default HomePage;
