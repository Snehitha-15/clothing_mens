// src/pages/HomePage.jsx
import React from "react";
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, Button } from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TopBannerSection from "../components/TopBannerSection"; // ✅ import

// 🖼️ Product images
import shirt1 from "../assets/images/shirts/shirt1.jpg";
import shirt10 from "../assets/images/shirts/shirt10.jpg";
import blazer16 from "../assets/images/Blazer/blazer16.jpg";
import blazer10 from "../assets/images/Blazer/blazer10.jpg";
import suit1 from "../assets/images/suits/suit11.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const newProducts = [
    { id: 1, name: "Grey Sweatshirt", price: 1099, image: blazer10 },
    { id: 2, name: "Formal Blazer", price: 2199, image: blazer16 },
    { id: 3, name: "Trendy Jacket", price: 1999, image: shirt10 },
    { id: 4, name: "Casual Shirt", price: 1199, image: shirt1 },
  ];

  const specialProducts = [
    { id: 5, name: "Soft Wool Sweater", price: 1499, image: blazer10 },
    { id: 6, name: "Slim Fit Suit", price: 2599, image: suit1 },
    { id: 7, name: "Stylish Shirt", price: 999, image: shirt1 },
    { id: 8, name: "Modern Jacket", price: 1899, image: shirt10 },
  ];

  const bottomBanners = [
    { id: 1, title: "COATS & JACKETS", image: shirt10, category: "jackets" },
    { id: 2, title: "SPORTS JACKETS", image: blazer16, category: "sports" },
    { id: 3, title: "SUITS & BLAZERS", image: suit1, category: "suits" },
  ];

  return (
    <div className="homepage">
      {/* 🆕 Top Dual Banner Section */}
      <TopBannerSection />

      {/* 🆕 New Products Section */}
      <Container className="mt-5">
        <h3 className="section-title">New Products</h3>
        <Row>
          {newProducts.map((item) => (
            <Col md="3" key={item.id} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
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
            </Col>
          ))}
        </Row>

        {/* Special Products Section */}
        <h3 className="section-title mt-5">Special Products</h3>
        <Row>
          {specialProducts.map((item) => (
            <Col md="3" key={item.id} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
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
            </Col>
          ))}
        </Row>

        {/* 🧥 Bottom Category Banners */}
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
                <p>Explore our selection of premium designs for men</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
