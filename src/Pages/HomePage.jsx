// src/pages/HomePage.jsx
import React from "react";
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
import BannerSlider from "../components/BannerSlider";
import TopBannerSection from "../components/TopBannerSection"; // 🆕 Added import

// 🖼️ Product Images
import Shirt from "../assets/images/shirts/shirt13.jpg";
import sweatshirt from "../assets/images/sweatshirts/sweatshirt18.jpg";
import Jeans from "../assets/images/jeans/jeans13.jpg";

// 💡 Suggested Product List
const suggestedProducts = [
  {
    id: 101,
    name: "Casual Shirts",
    price: 899,
    image: Shirt,
  },
  {
    id: 102,
    name: "Winter Wear",
    price: 1999,
    image: sweatshirt,
  },
  {
    id: 103,
    name: "Denim Jeans",
    price: 1299,
    image: Jeans,
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* 🆕 Top Dual Banner Section (Carousel + Static Banner) */}
      <TopBannerSection />

      {/* ✅ 3 Clickable Banners (Existing Banner Slider) */}
      <section style={{ marginTop: "30px" }}>
        <BannerSlider />
      </section>

      {/* ✅ Suggested Products Section */}
      <Container className="mt-3">
        <h2 className="text-center mb-4">Suggested for You</h2>
        <Row>
          {suggestedProducts.map((item) => (
            <Col md="4" key={item.id} className="mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/products/${item.name.toLowerCase()}`)
                  }
                >
                  <CardImg
                    top
                    src={item.image}
                    alt={item.name}
                    style={{
                      height: "250px",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                  />
                  <CardBody className="text-center">
                    <CardTitle tag="h5">{item.name}</CardTitle>
                    <p className="text-muted">₹{item.price}</p>
                    <Button color="dark" onClick={() => navigate("/products")}>
                      View Collection
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
