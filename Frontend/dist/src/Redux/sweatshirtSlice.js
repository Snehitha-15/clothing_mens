// src/Redux/sweatshirtSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Import Sweatshirt images (replace with your actual image files)
import sweatshirt1 from "../assets/images/sweatshirts/sweatshirt1.jpg";
import sweatshirt2 from "../assets/images/sweatshirts/sweatshirt2.jpg";
import sweatshirt3 from "../assets/images/sweatshirts/sweatshirt3.jpg";
import sweatshirt4 from "../assets/images/sweatshirts/sweatshirt4.jpg";
import sweatshirt5 from "../assets/images/sweatshirts/sweatshirt5.jpg";
import sweatshirt6 from "../assets/images/sweatshirts/sweatshirt6.jpg";
import sweatshirt7 from "../assets/images/sweatshirts/sweatshirt7.jpg";
import sweatshirt8 from "../assets/images/sweatshirts/sweatshirt8.jpg";
import sweatshirt9 from "../assets/images/sweatshirts/sweatshirt9.jpg";
import sweatshirt10 from "../assets/images/sweatshirts/sweatshirt10.jpg";
import sweatshirt11 from "../assets/images/sweatshirts/sweatshirt11.jpg";
import sweatshirt12 from "../assets/images/sweatshirts/sweatshirt12.jpg";
import sweatshirt13 from "../assets/images/sweatshirts/sweatshirt13.jpg";
import sweatshirt14 from "../assets/images/sweatshirts/sweatshirt14.jpg";
import sweatshirt15 from "../assets/images/sweatshirts/sweatshirt15.jpg";
import sweatshirt16 from "../assets/images/sweatshirts/sweatshirt16.jpg";
import sweatshirt17 from "../assets/images/sweatshirts/sweatshirt17.jpg";
import sweatshirt18 from "../assets/images/sweatshirts/sweatshirt18.jpg";

// ✅ Sweatshirt data
const initialState = {
  sweatshirts: [
    { id: 1, name: "Classic Crew Sweatshirt", price: 1499, image: sweatshirt1, description: "Simple crew sweatshirt for everyday wear." },
    { id: 2, name: "Hooded Sweatshirt", price: 1699, image: sweatshirt2, description: "Comfortable hoodie sweatshirt with drawstrings." },
    { id: 3, name: "Zipper Sweatshirt", price: 1799, image: sweatshirt3, description: "Front-zip sweatshirt with ribbed cuffs." },
    { id: 4, name: "Printed Sweatshirt", price: 1599, image: sweatshirt4, description: "Trendy printed design for casual looks." },
    { id: 5, name: "Color Block Sweatshirt", price: 1699, image: sweatshirt5, description: "Bold color block design with soft fabric." },
    { id: 6, name: "Slim Fit Sweatshirt", price: 1499, image: sweatshirt6, description: "Modern slim fit sweatshirt for layering." },
    { id: 7, name: "Vintage Sweatshirt", price: 1599, image: sweatshirt7, description: "Retro-inspired design with soft cotton." },
    { id: 8, name: "Pocket Sweatshirt", price: 1699, image: sweatshirt8, description: "Functional pocket on front with stylish look." },
    { id: 9, name: "Striped Sweatshirt", price: 1499, image: sweatshirt9, description: "Horizontal striped pattern for casual wear." },
    { id: 10, name: "Fleece Sweatshirt", price: 1799, image: sweatshirt10, description: "Warm fleece material ideal for winter." },
    { id: 11, name: "Oversized Sweatshirt", price: 1699, image: sweatshirt11, description: "Relaxed oversized fit for comfort." },
    { id: 12, name: "Zip-up Hoodie", price: 1899, image: sweatshirt12, description: "Full zip hoodie for easy wear." },
    { id: 13, name: "Embroidered Sweatshirt", price: 1599, image: sweatshirt13, description: "Minimal embroidery for subtle style." },
    { id: 14, name: "Plain Grey Sweatshirt", price: 1499, image: sweatshirt14, description: "Classic plain grey sweatshirt for versatile styling." },
    { id: 15, name: "Athletic Sweatshirt", price: 1699, image: sweatshirt15, description: "Breathable sweatshirt for sports or training." },
    { id: 16, name: "Hoodless Sweatshirt", price: 1399, image: sweatshirt16, description: "Simple crew-neck sweatshirt without hood." },
    { id: 17, name: "Retro Print Sweatshirt", price: 1599, image: sweatshirt17, description: "Vintage-inspired print with comfortable fabric." },
    { id: 18, name: "Black Minimal Sweatshirt", price: 1499, image: sweatshirt18, description: "Plain black sweatshirt for everyday use." },
  ],
};

// ✅ Create Slice
const sweatshirtsSlice = createSlice({
  name: "sweatshirts",
  initialState,
  reducers: {},
});

// ✅ Export reducer
export default sweatshirtsSlice.reducer;
