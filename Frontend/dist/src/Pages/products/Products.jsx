// src/Pages/products/Products.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../Redux/cartSlice";
import { useLocation } from "react-router-dom";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const { all } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation();
  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  let products = all;

  // Filter by selected category or subcategory
  if (selectedCategory) {
    products = all.filter(
      (item) =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        item.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // Filter by search input
  if (searchQuery) {
    products = all.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
    );
  }

  return (
    <div className="products-container px-4 py-3">
      <Row
        className="g-3 d-flex justify-content-start"
        style={{ marginLeft: "0", marginRight: "0" }}
      >
        {products.length > 0 ? (
          products.map((item) => {
            const existing = cartItems.find((i) => i.id === item.id);
            return (
              <Col
                xs="12"
                sm="6"
                md="4"
                lg="2"
                key={item.id}
                className="d-flex"
                style={{ paddingLeft: "5px", paddingRight: "5px" }}
              >
                <Card
                  className="product-card shadow-sm w-100"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "10px",
                  }}
                >
                  {/* IMAGE */}
                  <div style={{ height: "300px", overflow: "hidden" }}>
                    <CardImg
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* DETAILS */}
                  <CardBody style={{ padding: "10px" }}>
                    <CardTitle
                      tag="h6"
                      className="fw-bold mb-1 text-center"
                      style={{ fontSize: "15px" }}
                    >
                      {item.name}
                    </CardTitle>

                    <CardText
                      className="text-center mb-1"
                      style={{ fontSize: "13px", color: "#666" }}
                    >
                      {item.description}
                    </CardText>

                    {/* PRICE & ADD TO CART */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span
                        className="price fw-bold"
                        style={{ fontSize: "15px" }}
                      >
                        ₹{item.price}
                      </span>

                      {existing ? (
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            size="sm"
                            color="secondary"
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                          >
                            −
                          </Button>
                          <span>{existing.quantity}</span>
                          <Button
                            size="sm"
                            color="secondary"
                            onClick={() => dispatch(increaseQuantity(item.id))}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          color="dark"
                          style={{
                            borderRadius: "20px",
                            padding: "5px 12px",
                            fontSize: "13px",
                          }}
                          onClick={() => dispatch(addToCart(item))}
                        >
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
