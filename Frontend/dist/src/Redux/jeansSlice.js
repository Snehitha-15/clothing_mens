// src/Redux/jeansSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Import Jeans images
import jeans1 from "../assets/images/jeans/jeans1.jpg";
import jeans2 from "../assets/images/jeans/jeans2.jpg";
import jeans3 from "../assets/images/jeans/jeans3.jpg";
import jeans4 from "../assets/images/jeans/jeans4.jpg";
import jeans5 from "../assets/images/jeans/jeans5.jpg";
import jeans6 from "../assets/images/jeans/jeans6.jpg";
import jeans7 from "../assets/images/jeans/jeans7.jpg";
import jeans8 from "../assets/images/jeans/jeans8.jpg";
import jeans9 from "../assets/images/jeans/jeans9.jpg";
import jeans10 from "../assets/images/jeans/jeans10.jpg";
import jeans11 from "../assets/images/jeans/jeans11.jpg";
import jeans12 from "../assets/images/jeans/jeans12.jpg";
import jeans13 from "../assets/images/jeans/jeans13.jpg";
import jeans14 from "../assets/images/jeans/jeans14.jpg";
import jeans15 from "../assets/images/jeans/jeans15.jpg";
import jeans16 from "../assets/images/jeans/jeans16.jpg";
import jeans17 from "../assets/images/jeans/jeans17.jpg";
import jeans18 from "../assets/images/jeans/jeans18.jpg";

// ✅ Jeans data
const initialState = {
  jeans: [
    { id: 1, name: "Slim Fit Blue Jeans", price: 1499, image: jeans1, description: "Classic slim fit jeans for everyday style." },
    { id: 2, name: "Regular Fit Black Jeans", price: 1599, image: jeans2, description: "Comfortable black jeans for casual outings." },
    { id: 3, name: "Ripped Denim Jeans", price: 1699, image: jeans3, description: "Trendy ripped jeans for a modern look." },
    { id: 4, name: "Stretch Skinny Jeans", price: 1799, image: jeans4, description: "Skinny jeans with added stretch for comfort." },
    { id: 5, name: "Light Wash Jeans", price: 1499, image: jeans5, description: "Light blue jeans perfect for summer." },
    { id: 6, name: "Dark Wash Jeans", price: 1599, image: jeans6, description: "Classic dark denim for a smart look." },
    { id: 7, name: "Cargo Denim Jeans", price: 1899, image: jeans7, description: "Jeans with utility pockets for a rugged style." },
    { id: 8, name: "Bootcut Jeans", price: 1699, image: jeans8, description: "Bootcut design for a vintage vibe." },
    { id: 9, name: "Tapered Fit Jeans", price: 1599, image: jeans9, description: "Tapered jeans that are stylish and comfortable." },
    { id: 10, name: "Vintage Wash Jeans", price: 1799, image: jeans10, description: "Retro-inspired denim with a faded look." },
    { id: 11, name: "Stretch Regular Jeans", price: 1599, image: jeans11, description: "Regular fit jeans with stretch for ease of movement." },
    { id: 12, name: "Slim Fit Grey Jeans", price: 1499, image: jeans12, description: "Modern grey slim fit jeans for casual wear." },
    { id: 13, name: "Black Ripped Jeans", price: 1699, image: jeans13, description: "Black denim with ripped design for edgy style." },
    { id: 14, name: "Classic Indigo Jeans", price: 1599, image: jeans14, description: "Indigo jeans for timeless fashion." },
    { id: 15, name: "Light Grey Jeans", price: 1499, image: jeans15, description: "Soft grey jeans for casual outfits." },
    { id: 16, name: "Stretch Skinny Black Jeans", price: 1799, image: jeans16, description: "Skinny black jeans with stretch for comfort." },
    { id: 17, name: "Distressed Blue Jeans", price: 1699, image: jeans17, description: "Distressed denim for a bold look." },
    { id: 18, name: "Classic Blue Relaxed Jeans", price: 1499, image: jeans18, description: "Relaxed fit jeans for everyday comfort." },
  ],
};

// ✅ Create Slice
const jeansSlice = createSlice({
  name: "jeans",
  initialState,
  reducers: {},
});

// ✅ Export reducer
export default jeansSlice.reducer;
