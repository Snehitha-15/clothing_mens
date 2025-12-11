import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";

import { fetchProducts } from "../../Redux/productSlice";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";

const Products = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { all: products, loading } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchWishlist());
  }, [dispatch]);

  let filtered = [...products];

  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  if (searchQuery && searchQuery !== "undefined") {
    filtered = filtered.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery)
    );
  }

  if (selectedCategory && selectedCategory !== "All") {
    filtered = filtered.filter((item) =>
      item.name?.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  const isWishlisted = (productId) =>
    wishlistItems.find(
      (w) => w.product === productId || w.product?.id === productId
    );

  return (
    <div className="products-page px-2 py-3">
      {loading && <p className="text-center">Loading products...</p>}

      <Row className="product-row">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const wished = isWishlisted(item.id);

            return (
              <Col xs="6" sm="4" md="3" lg="2" key={item.id}>
                <div className="product-card">

                  {/* Wishlist Button */}
                  <button
                    className="wishlist-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      wished
                        ? dispatch(removeFromWishlist(wished.id))
                        : dispatch(addToWishlist(item.id));
                    }}
                  >
                    {wished ? "❤️" : "🤍"}
                  </button>

                  {/* Image */}
                  <div
                    className="img-box"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img src={item.image} alt={item.name} />
                  </div>

                  {/* Info */}
                  <div className="info">
                    <h6 className="title">{item.name}</h6>

                    <div className="bottom-row">
                      <span className="price">₹{item.price}</span>
                      <button className="view-btn">View</button>
                    </div>
                  </div>

                </div>
              </Col>
            );
          })
        ) : (
          <p className="text-center">No Products Found</p>
        )}
      </Row>
    </div>
  );
};

export default Products;
