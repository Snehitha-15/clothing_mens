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

  /* ----------------------------------
        SEARCH FILTER
  -----------------------------------*/
  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  if (searchQuery && searchQuery !== "undefined") {
    filtered = filtered.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery)
    );
  }

 if (selectedCategory && selectedCategory !== "All") {
  const cat = selectedCategory.toLowerCase();

  filtered = filtered.filter((item) => {
    const name = item.name?.toLowerCase();

    // ---------- FORMAL PANT ----------
    if (cat.includes("formal") && cat.includes("pant")) {
      return name.includes("formal") && name.includes("pant");
    }

    // ---------- CASUAL PANT ----------
    if (cat.includes("casual") && cat.includes("pant")) {
      return name.includes("casual") && name.includes("pant");
    }

    // ---------- SHIRT (formal + casual only, NOT sweatshirt / t-shirt) ----------
    if (cat.includes("shirt") && !cat.includes("t-shirt") && !cat.includes("sweat")) {
      return (
        name.includes("shirt") &&
        !name.includes("sweatshirt") &&
        !name.includes("sweater") &&
        !name.includes("tshirt") &&
        !name.includes("t-shirt")
      );
    }

    // ---------- T-SHIRT ----------
    if (cat.includes("t") && cat.includes("shirt")) {
      return (
        name.includes("tshirt") ||
        name.includes("t-shirt") ||
        name.includes("t shirt")
      );
    }

    // ---------- SWEATSHIRT ----------
    if (cat.includes("sweatshirt")) {
      return name.includes("sweatshirt");
    }

    // ---------- SWEATER ----------
    if (cat.includes("sweater")) {
      return name.includes("sweater");
    }

    // ---------- SPORTS WEAR ----------
    if (cat.includes("sport") || cat.includes("track")) {
      return (
        name.includes("sport") ||
        name.includes("track") ||
        name.includes("jogger")
      );
    }

    // ---------- JEANS ----------
    if (cat.includes("jean")) {
      return name.includes("jeans");
    }

    return false;
  });
}

  /* ----------------------------------
        CHECK WISHLIST
  -----------------------------------*/
  const isWishlisted = (productId) =>
    wishlistItems.find(
      (w) => w.product === productId || w.product?.id === productId
    );

  /* ----------------------------------
        RENDER
  -----------------------------------*/
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

                  {/* IMAGE */}
                  <div
                    className="img-box"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img src={item.image} alt={item.name} />

                    {/* ⭐ Rating badge on image */}
                    <div className="rating-on-image">
                      ⭐ {item.rating || "4.3"}{" "}
                      <span className="count">
                        {item.ratingCount || "3.5k"}
                      </span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h6 className="title">{item.name}</h6>

                  {/* PRICE */}
                  <div className="price">₹{item.price}</div>

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
