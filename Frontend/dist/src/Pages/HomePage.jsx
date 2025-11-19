// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, Button } from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TopBannerSection from "../components/TopBannerSection";
import "./HomePage.css";

// Images
import shirt1 from "../assets/images/shirts/shirt1.jpg";
import shirt10 from "../assets/images/shirts/shirt10.jpg";
import blazer17 from "../assets/images/Blazer/blazer17.jpg";
import blazer18 from "../assets/images/Blazer/blazer18.jpg";
import suit3 from "../assets/images/suits/suit3.jpg";
import blazer4 from "../assets/images/Blazer/blazer4.jpg";

import shirt15 from "../assets/images/shirts/shirt15.jpg";
import shirt18 from "../assets/images/shirts/shirt18.jpg";
import blazer10 from "../assets/images/Blazer/blazer17.jpg";
import blazer8 from "../assets/images/Blazer/blazer18.jpg";
import shirt2 from "../assets/images/shirts/shirt2.jpg";
import blazer14 from "../assets/images/Blazer/blazer14.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const [showMoreNew, setShowMoreNew] = useState(false);
  const [showMoreSpecial, setShowMoreSpecial] = useState(false);

  const newProducts = [
    { id: 1, name: "Grey Sweatshirt", price: 1099, image: blazer18 },
    { id: 2, name: "Formal Blazer", price: 2199, image: blazer17 },
    { id: 3, name: "Trendy Jacket", price: 1999, image: shirt10 },
    { id: 4, name: "Casual Shirt", price: 1199, image: shirt1 },
    { id: 5, name: "Slim Fit Suit", price: 2599, image: suit3 },
    { id: 6, name: "Stylish Blazer", price: 699, image: blazer4 },

    { id: 7, name: "Winter Jacket", price: 1899, image: blazer18 },
    { id: 8, name: "Party Blazer", price: 2499, image: blazer17 },
    { id: 9, name: "Modern Shirt", price: 1099, image: shirt18 },
    { id: 10, name: "Royal Suit", price: 3299, image: suit3 }
  ];

  const specialProducts = [
    { id: 101, name: "Soft Wool Sweater", price: 1499, image: shirt15 },
    { id: 102, name: "Slim Fit Suit", price: 2599, image: blazer10 },
    { id: 103, name: "Stylish Shirt", price: 999, image: shirt18 },
    { id: 104, name: "Modern Jacket", price: 1899, image: blazer8 },
    { id: 105, name: "Formal Blazer", price: 2199, image: shirt2 },
    { id: 106, name: "Blazer", price: 2199, image: blazer14 },
    { id: 107, name: "Casual Jacket", price: 1599, image: blazer8 },
    { id: 108, name: "Classic Shirt", price: 1199, image: shirt1 },
    { id: 109, name: "Slim Blazer", price: 2999, image: blazer17 }
  ];

  const bottomBanners = [
    { id: 1, title: "COATS & JACKETS", image: shirt10, category: "jackets" },
    { id: 2, title: "SPORTS JACKETS", image: blazer18, category: "sports" },
    { id: 3, title: "SUITS & BLAZERS", image: blazer17, category: "blazer" },
  ];

  // PRODUCT SECTION
  const ProductSection = ({ title, products, showMore, setShowMore }) => {
    const visible = showMore ? products : products.slice(0, 6);

    return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center px-1">
          <h4 className="section-title m-0">{title}</h4>

          {!showMore ? (
            <p className="see-all-text" onClick={() => setShowMore(true)}>
              See All →
            </p>
          ) : (
            <p className="see-all-text" onClick={() => setShowMore(false)}>
              See Less ←
            </p>
          )}
        </div>

        <Row>
          {visible.map((item) => (
            <Col
              key={item.id}
              xl="2"   
              lg="3"   
              md="4"  
              sm="6"   
              xs="12" 
              className="mb-4"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="product-card" onClick={() => navigate(`/products/${item.id}`)}>
                  <CardImg src={item.image} alt={item.name} className="product-image" />
                  <CardBody className="text-center">
                    <CardTitle tag="h6">{item.name}</CardTitle>
                    <p className="text-muted">₹{item.price}</p>
                    <Button color="dark" size="sm">Add to Cart</Button>
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

        <ProductSection 
          title="Recommended Products"
          products={newProducts}
          showMore={showMoreNew}
          setShowMore={setShowMoreNew}
        />

        <ProductSection 
          title="Special Products"
          products={specialProducts}
          showMore={showMoreSpecial}
          setShowMore={setShowMoreSpecial}
        />

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
