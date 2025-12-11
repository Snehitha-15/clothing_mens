import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../Redux/productSlice";
import { addOrUpdateCart } from "../../Redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { single: product, loading } = useSelector((state) => state.products);

  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading || !product) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "30px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      {/* LEFT SECTION → LARGE PRODUCT IMAGE */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: "100%",
            height: "520px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <img
            src={selectedVariant?.image || product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* RIGHT SECTION → DETAILS */}
      <div style={{ flex: 1, paddingRight: "20px" }}>
        {/* PRODUCT NAME */}
        <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
          {product.name}
        </h1>

        {/* PRICE */}
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "25px",
            fontWeight: "600",
            color: "#111",
          }}
        >
          ₹{product.price}
        </h2>

        {/* SIZE SELECTOR */}
        <h3
          style={{
            fontSize: "18px",
            marginBottom: "12px",
            marginTop: "15px",
          }}
        >
          Select Size
        </h3>

        <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              style={{
                padding: "10px 18px",
                borderRadius: "25px",
                border:
                  selectedVariant?.id === v.id
                    ? "2px solid #242323ff"
                    : "1px solid #777",
                background:
                  selectedVariant?.id === v.id ? "#1f1d1eff" : "#fff",
                color: selectedVariant?.id === v.id ? "#fff" : "#000",
                cursor: "pointer",
                fontSize: "15px",
                minWidth: "55px",
                transition: "0.2s",
              }}
            >
              {v.size}
            </button>
          ))}
        </div>

        {/* STOCK & COLOR INFO */}
        {selectedVariant && (
          <div
            style={{
              background: "#f7f7f7",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "25px",
              fontSize: "15px",
            }}
          >
            <strong>Color:</strong> {selectedVariant.color} &nbsp; | &nbsp;
            <strong>Stock:</strong> {selectedVariant.stock}
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          disabled={!selectedVariant}
          onClick={() =>
            dispatch(
              addOrUpdateCart({
                variant: selectedVariant.id,
                quantity: 1,
              })
            )
          }
          style={{
            width: "100%",
            padding: "16px",
            background: selectedVariant ? "#1f1d1eff" : "#ccc",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: selectedVariant ? "pointer" : "not-allowed",
            fontSize: "18px",
            fontWeight: "600",
            boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            transition: "0.2s",
          }}
        >
          Add to Cart
        </button>

        {/* WISHLIST BTN (OPTIONAL) */}
        <button
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "2px solid #ccc",
            background: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ❤️ Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
