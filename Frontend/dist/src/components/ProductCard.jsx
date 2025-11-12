// import React from "react";
// import { Card, CardBody, CardImg, CardTitle, CardText, Button } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../Redux/cartSlice";

// const ProductCard = ({ item }) => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);
//   const existing = cartItems.find((i) => i.id === item.id);

//   return (
//     <Card className="product-card shadow-sm" style={{ fontSize: "14px" }}>
//       <CardImg
//         top
//         width="100%"
//         src={item.image}
//         alt={item.name}
//         style={{ height: "220px", objectFit: "cover" }}
//       />
//       <CardBody style={{ padding: "10px" }}>
//         <CardTitle tag="h6">{item.name}</CardTitle>
//         <CardText style={{ fontSize: "12px", minHeight: "40px" }}>
//           {item.description}
//         </CardText>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "5px",
//           }}
//         >
//           <span className="price">₹{item.price}</span>
//           <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             {existing && <span style={{ fontSize: "12px" }}>Qty: {existing.quantity}</span>}
//             <Button color="dark" size="sm" onClick={() => dispatch(addToCart(item))}>
//               Add to Cart
//             </Button>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default ProductCard;
