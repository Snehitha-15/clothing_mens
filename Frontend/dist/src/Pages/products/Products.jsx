// src/Pages/products/Products.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  Card, CardBody, CardImg, CardTitle, CardText,
  Button, Row, Col,
} from "reactstrap";
import {
  addToCart, increaseQuantity, decreaseQuantity,
} from "../../Redux/cartSlice";
import {
  addToWishlist, removeFromWishlist, fetchWishlist,
} from "../../Redux/wishlistSlice";
import { fetchProducts } from "../../Redux/productSlice"; // 🔹 Import fetchProducts
import { fetchCategories } from "../../Redux/categorySlice"; // 🔹 Optional: Get categories
import { useLocation, useNavigate } from "react-router-dom";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 ALWAYS FETCH PRODUCTS (even when user is not logged in)
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

  // 🔹 Fetch wishlist only when logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
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
      item?.product === productId ||          // when backend returns product ID
      item?.product?.id === productId         // when backend returns product object
  );


  return (
    <div className="products-container px-4 py-3">
      {filteredProducts.length === 0 ? (
        <p className="text-center w-100 mt-4">No products found.</p>
      ) : (
        <Row className="g-3 justify-content-start" style={{ margin: 0 }}>
          {filteredProducts.map((item) => {
            const cartItem = cartItems.find((i) => i.id === item.id);
            const wishlistItem = getWishlistItem(item.id);

            return (
              <Col xs="12" sm="6" md="4" lg="3" xl="2" key={item.id} className="d-flex px-2 mb-3">
                <Card className="shadow-md w-100" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ position: "relative", height: "300px" }}>
                    <CardImg src={item.image} alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                    {/* ❤️ Wishlist Button */}
                    <button
  onClick={() => {
    if (!user) {
      navigate("/login");
    } else {
      if (wishlistItem) {
        dispatch(removeFromWishlist(wishlistItem.id));
      } else {
        dispatch(addToWishlist(item.id));
      }
    }
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "white",
    border: "none",
    borderRadius: "50%",
    padding: "7px",
    cursor: user ? "pointer" : "not-allowed",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  {wishlistItem ? (
    // 🔴 Red Heart - Wishlisted
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="red" viewBox="0 0 16 16">
      <path d="M8 2.748-.717-.737C5.6-.281 2.514 1.07 1.4 3.053c-1.118 2-.532 4.385 1.212 5.904L8 15l5.388-6.043c1.744-1.519 2.33-3.904 1.212-5.904C13.486 1.07 10.4-.28 8.717.011L8 2.748z" />
    </svg>
  ) : (
    // 🤍 Outlined Heart - Not Wishlisted
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="black" viewBox="0 0 16 16">
      <path d="M8 2.748-.717-.737C5.6-.281 2.514 1.07 1.4 3.053c-1.118 2-.532 4.385 1.212 5.904L8 15l5.388-6.043c1.744-1.519 2.33-3.904 1.212-5.904C13.486 1.07 10.4-.28 8.717.011L8 2.748z" />
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
                          <Button size="sm" onClick={() => dispatch(decreaseQuantity(item.id))}>
                            −
                          </Button>
                          <span>{cartItem.quantity}</span>
                          <Button size="sm" onClick={() => dispatch(increaseQuantity(item.id))}>
                            +
                          </Button>
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
          })}
        </Row>
      )}
    </div>
  );
};

export default Products;
