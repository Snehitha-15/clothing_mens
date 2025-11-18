// src/Pages/products/Products.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import '../../App.css';
import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
} from "reactstrap";
import { addToCart, increaseQuantity, decreaseQuantity } from "../../Redux/cartSlice";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search")?.toLowerCase();

  const state = useSelector((state) => state);

  const categoryMap = {
    shirts: state.shirts.shirts,
    pants: state.pants.pants,
    jeans: state.jeans.jeans,
    blazers: state.blazers.blazers,
    jackets: state.jackets.jackets,
    suits: state.suits.suits,
    shorts: state.shorts.shorts,
    tshirts: state.tshirts.tshirts,
    sweaters: state.sweaters.sweaters,
    sweatshirts: state.sweatshirts.sweatshirts,
  };

  const keyMap = {
    "t-shirts": "tshirts",
    "tshirt": "tshirts",
    "t shirts": "tshirts",
    "sweatshirts": "sweatshirts",
    "sweat shirts": "sweatshirts",
    shirts: "shirts",
    pants: "pants",
    jeans: "jeans",
    blazers: "blazers",
    jackets: "jackets",
    suits: "suits",
    shorts: "shorts",
    sweaters: "sweaters",
  };

  const allProducts = Object.values(categoryMap).flat();

  let products = [];

  if (searchQuery && keyMap[searchQuery]) {
    products = categoryMap[keyMap[searchQuery]] || [];
  } else if (searchQuery) {
    products = allProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
    );
  } else if (selectedCategory) {
    const correctCategory = keyMap[selectedCategory.toLowerCase()];
    products = categoryMap[correctCategory] || [];
  }

  return (
    <div className="products-container p-4">
      <Row>
        {products.length > 0 ? (
          products.map((item) => {
            const existing = cartItems.find((i) => i.id === item.id);
            return (
              <Col
                xs="12"    
                sm="6"     
                md="4"      
                lg="3"      
                xl="2"    
                key={item.id}
                className="mb-4 d-flex"
              >
                <Card className="product-card shadow-sm w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "260px", overflow: "hidden" }}>
                    <CardImg
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <CardBody className="text-center">
                    <CardTitle tag="h6" className="fw-bold">{item.name}</CardTitle>
                    <CardText style={{ fontSize: "13px", minHeight: "40px" }}>
                      {item.description}
                    </CardText>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
                      <span className="price fw-bold">₹{item.price}</span>

                      {existing ? (
                        <div className="d-flex align-items-center gap-2">
                          <Button size="sm" color="secondary" onClick={() => dispatch(decreaseQuantity(item.id))}>−</Button>
                          <span>{existing.quantity}</span>
                          <Button size="sm" color="secondary" onClick={() => dispatch(increaseQuantity(item.id))}>+</Button>
                        </div>
                      ) : (
                        <Button size="sm" color="dark" onClick={() => dispatch(addToCart(item))}>
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })
        ) : (
          <p className="text-center w-100 mt-4">No products found.</p>
        )}
      </Row>
    </div>
  );
};

export default Products;
