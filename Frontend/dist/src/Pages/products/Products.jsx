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
  Table,
} from "reactstrap";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../../Redux/cartSlice";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;

  const products = useSelector((state) => {
    if (!selectedCategory) return [];
    const map = {
      "t-shirts": "tshirts",
      "sweatshirts": "sweatshirts",
      "blazers": "blazers",
      "jackets": "jackets",
      "shirts": "shirts",
      "pants": "pants",
      "shorts": "shorts",
      "sweaters": "sweaters",
      "jeans": "jeans",
      "suits": "suits",
    };
    const key =
      map[selectedCategory.toLowerCase()] || selectedCategory.toLowerCase();
    return state[key]?.[key] || [];
  });

  return (
    <div className="products-container p-4">
      {/* ✅ Category Heading */}
      {selectedCategory && (
        <h2 className="section-title text-center mb-4">
          Men’s {selectedCategory} Collection
        </h2>
      )}

      {/* ✅ Product Cards */}
      <Row>
        {products && products.length > 0 ? (
          products.map((item) => {
            const existing = cartItems.find((i) => i.id === item.id);
            return (
              <Col md="4" lg="2" key={item.id} className="mb-3">
                <Card
                  className="product-card shadow-sm"
                  style={{ fontSize: "14px" }}
                >
                  <CardImg
                    top
                    width="100%"
                    src={item.image}
                    alt={item.name}
                    style={{ height: "220px" }}
                  />
                  <CardBody style={{ padding: "10px" }}>
                    <CardTitle tag="h6">{item.name}</CardTitle>
                    <CardText
                      style={{ fontSize: "12px", minHeight: "40px" }}
                    >
                      {item.description}
                    </CardText>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <span className="price">₹{item.price}</span>
                      {existing ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() =>
                              dispatch(decreaseQuantity(item.id))
                            }
                          >
                            –
                          </Button>
                          <span>{existing.quantity}</span>
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() =>
                              dispatch(increaseQuantity(item.id))
                            }
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          color="dark"
                          size="sm"
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
          <p className="text-center w-100 mt-4">
            No products available in this category.
          </p>
        )}
      </Row>
    </div>
  );
};

export default Products;
