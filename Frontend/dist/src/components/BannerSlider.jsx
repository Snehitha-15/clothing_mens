// // src/components/BannerSlider.jsx
// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import shirt1 from "../assets/images/shirts/shirt1.jpg";
// import jacket10 from "../assets/images/jackets/jacket10.jpg";
// import blazer10 from "../assets/images/Blazer/blazer10.jpg";

// const banners = [
//   {
//     id: 1,
//     image: shirt1,
//     category: "shirts",
//     title: "Trendy Men's Collection",
//   },
//   {
//     id: 2,
//     image: jacket10,
//     category: "jackets",
//     title: "Stylish Jackets for Men",
//   },
//   {
//     id: 3,
//     image: blazer10,
//     category: "pants",
//     title: "Exclusive Blazzer Collection For Men",
//   },
// ];

// const BannerSlider = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="banner-slider" style={{ overflow: "hidden" }}>
//       <div
//         style={{
//           display: "flex",
//           gap: "20px",
//           justifyContent: "center",
//           flexWrap: "wrap",
//         }}
//       >
//         {banners.map((banner, index) => (
//           <motion.div
//             key={banner.id}
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: "spring", stiffness: 200 }}
//             onClick={() => navigate(`/products/${banner.category}`)}
//             style={{
//               cursor: "pointer",
//               borderRadius: "15px",
//               overflow: "hidden",
//               position: "relative",
//               width: "400px",
//               height: "300px",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <img
//               src={banner.image}
//               alt={banner.title}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 transition: "transform 0.5s ease",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: 0,
//                 left: 0,
//                 width: "100%",
//                 background: "rgba(0, 0, 0, 0.6)",
//                 color: "white",
//                 textAlign: "center",
//                 padding: "10px",
//                 fontWeight: "bold",
//                 fontSize: "1.1rem",
//               }}
//             >
//               {banner.title}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BannerSlider;
