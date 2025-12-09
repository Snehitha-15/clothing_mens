import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Card, CardBody, CardImg, CardTitle, CardText,
  Button, Row, Col,
} from "reactstrap";

import {
  increaseQuantity,
  decreaseQuantity,
  addOrUpdateCart
} from "../../Redux/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist
} from "../../Redux/wishlistSlice";

import { fetchProducts } from "../../Redux/productSlice";
import { fetchCategories } from "../../Redux/categorySlice";

import { useLocation, useNavigate } from "react-router-dom";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const { all: products } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();
  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [dispatch, user]);

  let filteredProducts = products;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (item) =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        item.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
    );
  }

  const getWishlistItem = (productId) =>
    wishlistItems.find(
      (item) =>
        item?.product === productId || item?.product?.id === productId
    );

  return (
    <div className="products-container px-4 py-3">
      {filteredProducts.length === 0 ? (
        <p className="text-center w-100 mt-4">No products found.</p>
      ) : (
        <Row className="g-3 justify-content-start" style={{ margin: 0 }}>
          {filteredProducts.map((item) => {
            const cartItem = cartItems.find((c) => c.id === item.id);
            const wishlistItem = getWishlistItem(item.id);

            return (
              <Col xs="12" sm="6" md="4" lg="3" xl="2" key={item.id} className="d-flex px-2 mb-3">
                <Card className="shadow-md w-100" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ position: "relative", height: "300px" }}>
                    <CardImg
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />

                    {/* ❤️ Wishlist Button */}
<button
  onClick={() => {
    if (!user) {
      navigate("/login");
    } else {
      wishlistItem
        ? dispatch(removeFromWishlist(wishlistItem.id))
        : dispatch(addToWishlist(item.id));
    }
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    padding: "10px",
    margin: "0",
    outline: "none",
    cursor: user ? "pointer" : "not-allowed",
  }}
>
  {wishlistItem ? (
    // ❤️ SAME STYLE — BIGGER FILLED HEART
    <svg
      width="19"
      height="19"
      viewBox="0 0 16 16"
      style={{ transform: "scale(1.7)" }}   // ⭐ SAME LOOK, BIGGER SIZE
      fill="red"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 2.748-.717-.737C5.6-.281 2.514 1.07 1.4 3.053c-1.118 2-.532 4.385 
      1.212 5.904L8 15l5.388-6.043c1.744-1.519 2.33-3.904 
      1.212-5.904C13.486 1.07 10.4-.28 8.717.011L8 2.748z" />
    </svg>
  ) : (
    // 🤍 SAME STYLE — BIGGER OUTLINE HEART
    <svg
      width="19"
      height="19"
      viewBox="0 0 16 16"
      style={{ transform: "scale(1.7)" }}  
      fill="none"
      stroke="black"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 2.748-.717-.737C5.6-.281 2.514 1.07 1.4 3.053c-1.118 2-.532 4.385 
      1.212 5.904L8 15l5.388-6.043c1.744-1.519 2.33-3.904 
      1.212-5.904C13.486 1.07 10.4-.28 8.717.011L8 2.748z" />
    </svg>
  )}
</button>

                  </div>

                  <CardBody className="text-center">
                    <CardTitle tag="h6" className="fw-bold mb-2">
                      {item.name}
                    </CardTitle>

                    <CardText style={{ fontSize: "13px", color: "#666" }}>
                      {item.description}
                    </CardText>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="fw-bold">₹{item.price}</span>

                      {cartItem ? (
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                          >
                            −
                          </Button>

                          <span>{cartItem.quantity}</span>

                          <Button
                            size="sm"
                            onClick={() =>
                              dispatch(addOrUpdateCart({ product_id: item.id, quantity: cartItem.quantity + 1 }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          color="dark"
                          onClick={() =>
                            dispatch(addOrUpdateCart({ product_id: item.id, quantity: 1 }))
                          }
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Products;
