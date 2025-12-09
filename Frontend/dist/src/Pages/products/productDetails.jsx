import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addOrUpdateCart,
  decreaseQuantity,
} from "../../Redux/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../Redux/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { all: products } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 📌 Find the product
  const product = products.find((p) => p.id === Number(id));

  // 📌 Wishlist item
  const wishlistItem = wishlistItems.find(
    (w) => w?.product === product?.id || w?.product?.id === product?.id
  );

  // 📌 Cart item
  const cartItem = cartItems.find((c) => c.id === product?.id);

  // 📌 Set first image
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // ❌ If product not found — stop rendering
  if (!product) {
    return <h3 className="text-center mt-5">Product Not Found</h3>;
  }

  const sizes = product.sizes || ["S", "M", "L", "XL"];

  return (
    <div className="container py-4">
      <div className="row">

        {/* LEFT IMAGES */}
        <div className="col-md-6 d-flex">

          {/* Thumbnail Column */}
          <div className="d-flex flex-column me-3">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: "70px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  border: selectedImage === img ? "2px solid black" : "1px solid #ddd",
                  cursor: "pointer",
                }}
                alt="thumb"
              />
            ))}
          </div>

          {/* Main Image */}
          <div style={{ width: "100%" }}>
            <img
              src={selectedImage}
              alt="main"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: "zoom-in",
              }}
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="col-md-6">

          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>

          <h3 className="text-success fw-bold">₹{product.price}</h3>

          {/* SIZE SELECT */}
          <div className="mt-4">
            <h6 className="fw-bold">Select Size</h6>
            <div className="d-flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`btn ${
                    selectedSize === size ? "btn-dark" : "btn-outline-dark"
                  }`}
                  style={{
                    borderRadius: "50px",
                    width: "60px",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* WISHLIST */}
          <button
            className="btn btn-light mt-4 px-4 py-2"
            onClick={() => {
              if (!user) return navigate("/login");
              wishlistItem
                ? dispatch(removeFromWishlist(wishlistItem.id))
                : dispatch(addToWishlist(product.id));
            }}
          >
            {wishlistItem ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
          </button>

          {/* CART */}
          <div className="mt-4">
            {cartItem ? (
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-dark"
                  onClick={() => dispatch(decreaseQuantity(product.id))}
                >
                  −
                </button>

                <span className="fw-bold">{cartItem.quantity}</span>

                <button
                  className="btn btn-dark"
                  onClick={() =>
                    dispatch(
                      addOrUpdateCart({
                        product_id: product.id,
                        quantity: cartItem.quantity + 1,
                      })
                    )
                  }
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn btn-dark px-4 py-2"
                onClick={() =>
                  dispatch(
                    addOrUpdateCart({
                      product_id: product.id,
                      quantity: 1,
                    })
                  )
                }
              >
                Add to Cart
              </button>
            )}
          </div>

        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="mt-5">
        <h4 className="fw-bold mb-3">Similar Products</h4>

        <div className="row">
          {products
            .filter(
              (p) =>
                p.category === product.category && p.id !== product.id
            )
            .slice(0, 4)
            .map((p) => (
              <div
                key={p.id}
                className="col-6 col-md-3"
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={p.images?.[0] || p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    height: "280px",
                    objectFit: "cover",
                  }}
                />
                <p className="fw-bold mt-2">{p.name}</p>
                <p className="text-success fw-bold">₹{p.price}</p>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
