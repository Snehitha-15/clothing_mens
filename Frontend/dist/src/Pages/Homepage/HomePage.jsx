// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import TopBannerSection from "../../components/TopBannerSection";
import image1 from "../../assets/images/Tshirts/tshirt3.jpg"
import image2 from "../../assets/images/shirts/shirt3.jpg"
import image3 from "../../assets/images/shirts/shirt7.jpg"
import image4 from "../../assets/images/pants/pant5.jpg"

import Shirt from "../../assets/images/shirts/shirt6.jpg"
import Jacket from "../../assets/images/jackets/jacket8.jpg"
import "./HomePage.css";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../Redux/wishlistSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showMoreNew, setShowMoreNew] = useState(false);
  const [showMoreSpecial, setShowMoreSpecial] = useState(false);

  // ⭐ Wishlist from Redux
  const wishlist = useSelector((state) => state.wishlist.items || []);

  // ⭐ Convert wishlist item → product object
  const wishlistProducts = [...wishlist] 
    .sort(() => Math.random() - 0.5)      
    .map((item) => item.product || item)      
    .slice(0, 6);                             

  // ⭐ Dispatch wishlist when HomePage loads
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Static Special Products (you can replace later)
  const recommendedProducts = [
    { id: 101, name: "Soft Wool Sweater", price: 1499, image: image1 },
    { id: 102, name: "Slim Fit Suit", price: 2599, image: image2 },
    { id: 103, name: "Stylish Shirt", price: 999, image: image3 },
    { id: 104, name: "Modern Jacket", price: 1899, image: image4 },
    { id: 105, name: "Soft Wool Sweater", price: 1499, image: image1 },
    { id: 106, name: "Slim Fit Suit", price: 2599, image: image2 },
    { id: 107,  name: "Stylish Shirt", price: 999, image: image3 },
    { id: 108, name: "Modern Jacket", price: 1899, image: image4 },
  ];

  // Static Bottom Banners
  const bottomBanners = [
    { id: 1, title: "COATS & JACKETS", image: Shirt, category: "jackets" },
    { id: 2, title: "SPORTS JACKETS", image: Jacket, category: "sports" },
    { id: 3, title: "SUITS & BLAZERS", image: image3, category: "blazer" },
  ];

  // ⭐ Reusable product card section
  const ProductSection = ({ title, products, showMore, setShowMore }) => {
    const visible = showMore ? products : products.slice(0, 6);

    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center px-1">
          <h4 className="section-title m-0">{title}</h4>
          <p className="see-all-text" onClick={() => setShowMore(!showMore)}>
            {showMore ? "See Less ←" : "See All →"}
          </p>
        </div>

        <Row>
          {visible.map((product) => (
            <Col key={product.id} xl="2" lg="3" md="4" sm="6" xs="12" className="mb-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card
                  className="product-card"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardImg src={product.image} alt={product.name} className="product-image" />

                  <CardBody className="text-center">
                    <CardTitle tag="h6">{product.name}</CardTitle>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <p className="text-dark fw-bold">₹{product.price}</p>
                      <Button color="dark" size="sm">Add to Cart</Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="homepage">
      <TopBannerSection />

      <Container fluid className="mt-4 px-3">

        {/* 🌟 Recommended Products From Wishlist */}
        <ProductSection
          title="Wishlisted Products"
          products={wishlistProducts}
          showMore={showMoreNew}
          setShowMore={setShowMoreNew}
        />

        {/* Special Products (Static or API later) */}
        <ProductSection
          title="Recommended Products"
          products={recommendedProducts}
          showMore={showMoreSpecial}
          setShowMore={setShowMoreSpecial}
        />

        {/* Bottom Static Banners */}
        <div className="bottom-banner-section">
          {bottomBanners.map((banner) => (
            <motion.div
              key={banner.id}
              className="bottom-banner mb-4"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/products/${banner.category}`)}
            >
              <img src={banner.image} alt={banner.title} />
              <div className="banner-overlay">
                <h4>{banner.title}</h4>
                <p>Explore our selection of premium men’s collection</p>
              </div>
            </motion.div>
          ))}
        </div>

      </Container>
    </div>
  );
};

export default HomePage;
