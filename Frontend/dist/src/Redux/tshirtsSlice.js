import { createSlice } from "@reduxjs/toolkit";

// Import T-shirt images
import tshirt1 from "../assets/images/Tshirts/tshirt1.jpg";
import tshirt2 from "../assets/images/Tshirts/tshirt2.jpg";
import tshirt3 from "../assets/images/Tshirts/tshirt3.jpg";
import tshirt4 from "../assets/images/Tshirts/tshirt4.jpg";
import tshirt5 from "../assets/images/Tshirts/tshirt5.jpg";
import tshirt6 from "../assets/images/Tshirts/tshirt6.jpg";
import tshirt7 from "../assets/images/Tshirts/tshirt7.jpg";
import tshirt8 from "../assets/images/Tshirts/tshirt8.jpg";
import tshirt9 from "../assets/images/Tshirts/tshirt9.jpg";
import tshirt10 from "../assets/images/Tshirts/tshirt10.jpg";
import tshirt11 from "../assets/images/Tshirts/tshirt11.jpg";
import tshirt12 from "../assets/images/Tshirts/tshirt12.jpg";
import tshirt13 from "../assets/images/Tshirts/tshirt13.jpg";
import tshirt14 from "../assets/images/Tshirts/tshirt14.jpg";
import tshirt15 from "../assets/images/Tshirts/tshirt15.jpg";
import tshirt16 from "../assets/images/Tshirts/tshirt16.jpg";
import tshirt17 from "../assets/images/Tshirts/tshirt17.jpg";
import tshirt18 from "../assets/images/Tshirts/tshirt18.jpg";

const initialState = {
  tshirts: [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 799,
      image: tshirt1,
      description: "Soft cotton white T-shirt with a regular fit."
    },
    {
      id: 2,
      name: "Graphic Print Tee",
      price: 899,
      image: tshirt2,
      description: "Trendy graphic print T-shirt for a casual look."
    },
    {
      id: 3,
      name: "Black Polo T-Shirt",
      price: 999,
      image: tshirt3,
      description: "Elegant black polo T-shirt made with breathable fabric."
    },
    {
      id: 4,
      name: "Striped T-Shirt",
      price: 849,
      image: tshirt4,
      description: "Stylish striped pattern T-shirt for a modern vibe."
    },
    {
      id: 5,
      name: "Round Neck T-Shirt",
      price: 799,
      image: tshirt5,
      description: "Classic round neck tee perfect for daily wear."
    },
    {
      id: 6,
      name: "V-Neck T-Shirt",
      price: 899,
      image: tshirt6,
      description: "Soft V-neck T-shirt offering a smart casual appearance."
    },
    {
      id: 7,
      name: "Printed Oversized Tee",
      price: 1099,
      image: tshirt7,
      description: "Trendy oversized T-shirt with a bold front print."
    },
    {
      id: 8,
      name: "Sports Dry-Fit T-Shirt",
      price: 999,
      image: tshirt8,
      description: "Moisture-wicking sports tee for active wear."
    },
    {
      id: 9,
      name: "Henley T-Shirt",
      price: 949,
      image: tshirt9,
      description: "Casual Henley-style T-shirt with buttoned neckline."
    },
    {
      id: 10,
      name: "Color Block T-Shirt",
      price: 999,
      image: tshirt10,
      description: "Color-block design T-shirt that adds contrast to your style."
    },
    {
      id: 11,
      name: "Full Sleeve T-Shirt",
      price: 899,
      image: tshirt11,
      description: "Comfortable full sleeve tee for everyday use."
    },
    {
      id: 12,
      name: "Muscle Fit Tee",
      price: 1099,
      image: tshirt12,
      description: "Stretchable muscle-fit T-shirt to enhance your physique."
    },
    {
      id: 13,
      name: "Pocket T-Shirt",
      price: 849,
      image: tshirt13,
      description: "Casual pocket tee made with high-quality cotton fabric."
    },
    {
      id: 14,
      name: "Retro Printed Tee",
      price: 999,
      image: tshirt14,
      description: "Vintage-inspired printed tee for a cool retro vibe."
    },
    {
      id: 15,
      name: "Plain Blue T-Shirt",
      price: 799,
      image: tshirt15,
      description: "Simple blue T-shirt that pairs well with any outfit."
    },
    {
      id: 16,
      name: "Typography Print Tee",
      price: 899,
      image: tshirt16,
      description: "Trendy typography printed tee for street-style fashion."
    },
    {
      id: 17,
      name: "Tie-Dye T-Shirt",
      price: 1099,
      image: tshirt17,
      description: "Colorful tie-dye T-shirt for a vibrant, youthful look."
    },
    {
      id: 18,
      name: "Plain Black T-Shirt",
      price: 799,
      image: tshirt18,
      description: "Classic black tee that never goes out of style."
    },
  ],
};

const tshirtsSlice = createSlice({
  name: "tshirts",
  initialState,
  reducers: {},
});

export default tshirtsSlice.reducer;
