import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Wishlist ({items.length})</h3>

      {items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card shadow-sm" style={{ borderRadius: "10px" }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                  className="card-img-top"
                />

                <div className="card-body text-center">
                  <h6>{item.product.name}</h6>
                  <p className="fw-bold">₹{item.product.price}</p>

                  <button
                    className="btn btn-sm btn-dark me-2"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    View Product
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
