import { createSlice } from "@reduxjs/toolkit";

// ✅ Import Sweater images (add your real image files here)
import sweater1 from "../assets/images/sweaters/sweater1.jpg";
import sweater2 from "../assets/images/sweaters/sweater2.jpg";
import sweater3 from "../assets/images/sweaters/sweater3.jpg";
import sweater4 from "../assets/images/sweaters/sweater4.jpg";
import sweater5 from "../assets/images/sweaters/sweater5.jpg";
import sweater6 from "../assets/images/sweaters/sweater6.jpg";
import sweater7 from "../assets/images/sweaters/sweater7.jpg";
import sweater8 from "../assets/images/sweaters/sweater8.jpg";
import sweater9 from "../assets/images/sweaters/sweater9.jpg";
import sweater10 from "../assets/images/sweaters/sweater10.jpg";
import sweater11 from "../assets/images/sweaters/sweater11.jpg";
import sweater12 from "../assets/images/sweaters/sweater12.jpg";
import sweater13 from "../assets/images/sweaters/sweater13.jpg";
import sweater14 from "../assets/images/sweaters/sweater14.jpg";
import sweater15 from "../assets/images/sweaters/sweater15.jpg";
import sweater16 from "../assets/images/sweaters/sweater16.jpg";
import sweater17 from "../assets/images/sweaters/sweater17.jpg";
import sweater18 from "../assets/images/sweaters/sweater18.jpg";

// ✅ Sweater data
const initialState = {
  sweaters: [
    {
      id: 1,
      name: "Classic Wool Sweater",
      price: 1499,
      image: sweater1,
      description: "Warm wool sweater perfect for winter evenings.",
    },
    {
      id: 2,
      name: "Cable Knit Sweater",
      price: 1699,
      image: sweater2,
      description: "Traditional cable knit design with a soft texture.",
    },
    {
      id: 3,
      name: "Turtleneck Sweater",
      price: 1599,
      image: sweater3,
      description: "Stylish turtleneck that pairs well with jeans.",
    },
    {
      id: 4,
      name: "V-Neck Sweater",
      price: 1399,
      image: sweater4,
      description: "Lightweight V-neck sweater for casual layering.",
    },
    {
      id: 5,
      name: "Crew Neck Sweater",
      price: 1299,
      image: sweater5,
      description: "Simple crew neck sweater made of fine cotton blend.",
    },
    {
      id: 6,
      name: "Half Zip Pullover sweater",
      price: 1599,
      image: sweater6,
      description: "Half-zip pullover sweater with ribbed cuffs and hem.",
    },
    {
      id: 7,
      name: "Patterned Sweater",
      price: 1699,
      image: sweater7,
      description: "Modern pattern design with premium warmth.",
    },
    {
      id: 8,
      name: "Striped Knit Sweater",
      price: 1499,
      image: sweater8,
      description: "Horizontal striped sweater in soft wool blend.",
    },
    {
      id: 9,
      name: "Chunky Knit Sweater",
      price: 1799,
      image: sweater9,
      description: "Thick chunky knit sweater for extreme comfort.",
    },
    {
      id: 10,
      name: "Buttoned Cardigan Sweater",
      price: 1899,
      image: sweater10,
      description: "Cardigan-style sweater with button-up closure.",
    },
    {
      id: 11,
      name: "Ribbed Texture Sweater",
      price: 1499,
      image: sweater11,
      description: "Soft ribbed texture with breathable comfort.",
    },
    {
      id: 12,
      name: "Hooded Sweater",
      price: 1699,
      image: sweater12,
      description: "Casual hoodie sweater with a relaxed fit.",
    },
    {
      id: 13,
      name: "Slim Fit Sweater",
      price: 1599,
      image: sweater13,
      description: "Modern slim fit sweater for a smart winter look.",
    },
    {
      id: 14,
      name: "Plain Beige Sweater",
      price: 1399,
      image: sweater14,
      description: "Minimalist beige sweater made with soft fibers.",
    },
    {
      id: 15,
      name: "Color Block Sweater",
      price: 1699,
      image: sweater15,
      description: "Trendy color block design adds bold style.",
    },
    {
      id: 16,
      name: "Winter Fleece Sweater",
      price: 1799,
      image: sweater16,
      description: "Ultra-warm fleece sweater for chilly weather.",
    },
    {
      id: 17,
      name: "Retro Knit Sweater",
      price: 1599,
      image: sweater17,
      description: "Retro design with cozy knitted fabric.",
    },
    {
      id: 18,
      name: "Plain Black Sweater",
      price: 1499,
      image: sweater18,
      description: "Classic black sweater that goes with anything.",
    },
  ],
};

// ✅ Create Slice
const sweatersSlice = createSlice({
  name: "sweaters",
  initialState,
  reducers: {},
});

// ✅ Export reducer
export default sweatersSlice.reducer;
