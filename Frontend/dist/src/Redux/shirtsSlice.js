import { createSlice } from "@reduxjs/toolkit";

import shirt1 from "../assets/images/shirts/shirt1.jpg";
import shirt2 from "../assets/images/shirts/shirt2.jpg";
import shirt3 from "../assets/images/shirts/shirt3.jpg";
import shirt4 from "../assets/images/shirts/shirt4.jpg";
import shirt5 from "../assets/images/shirts/shirt5.jpg";
import shirt6 from "../assets/images/shirts/shirt6.jpg";
import shirt7 from "../assets/images/shirts/shirt7.jpg";
import shirt8 from "../assets/images/shirts/shirt8.jpg";
import shirt9 from "../assets/images/shirts/shirt9.jpg";
import shirt10 from "../assets/images/shirts/shirt10.jpg";
import shirt11 from "../assets/images/shirts/shirt11.jpg";
import shirt12 from "../assets/images/shirts/shirt12.jpg";
import shirt13 from "../assets/images/shirts/shirt13.jpg";
import shirt14 from "../assets/images/shirts/shirt14.jpg";
import shirt15 from "../assets/images/shirts/shirt15.jpg";
import shirt16 from "../assets/images/shirts/shirt16.jpg";
import shirt17 from "../assets/images/shirts/shirt17.jpg";
import shirt18 from "../assets/images/shirts/shirt18.jpg";


const initialState = {
  shirts: [
    {
      id: 1,
      name: "Classic Cotton Shirt",
      price: 1199,
      image: shirt1,
      description: "Premium shirt made with 100% cotton for a smooth feel."
    },
    {
      id: 2,
      name: " Denim Casual Shirt",
      price: 1399,
      image: shirt2,
      description: "Stylish denim shirt for a casual yet confident look."
    },
    {
      id: 3,
      name: "Slim Fit Formal Shirt",
      price: 1499,
      image: shirt3,
      description: "Tailored fit shirt perfect for business meetings."
    },
    {
      id: 4,
      name: "Cotton Shirt",
      price: 1099,
      image: shirt4,
      description: "Trendy shirt for your daily comfort."
    },
    {
      id: 5,
      name: "Linen Casual Shirt",
      price: 1599,
      image: shirt5,
      description: "Soft breathable linen shirt ideal for summer wear."
    },
    {
      id: 6,
      name: "Formal Shirt",
      price: 1299,
      image: shirt6,
      description: "Elegant shirt designed for formal occasions."
    },
    {
      id: 7,
      name: "Olive Green Military Shirt",
      price: 1199,
      image: shirt7,
      description: "Rugged shirt for outdoor lovers. "
    },
    {
      id: 8,
      name: "Grey Striped Shirt",
      price: 1499,
      image: shirt8,
      description: " Striped cotton shirt for a classy and comfortable look."
    },
    {
      id: 9,
      name: "Slim Shirt",
      price: 1399,
      image: shirt9,
      description: "Smart slim fit shirt perfect for evening wear."
    },
    {
      id: 10,
      name: "Blue Formal Checks Shirt",
      price: 1299,
      image: shirt10,
      description: " formal shirt for classy professionals."
    },
    {
      id: 11,
      name: "Khaki Cotton Shirt",
      price: 999,
      image: shirt11,
      description: "Casual khaki shirt made for comfort and durability."
    },
    {
      id: 12,
      name: "Navy Checked Office Shirt",
      price: 1199,
      image: shirt12,
      description: "Business casual shirt in Black."
    },
    {
      id: 13,
      name: "Printed Floral Shirt",
      price: 1399,
      image: shirt13,
      description: "Trendy Black shirt for parties and casual outings."
    },
    {
      id: 14,
      name: "Full Sleeve Linen Shirt",
      price: 1699,
      image: shirt14,
      description: "Breathable linen shirt with Half sleeves sleeves."
    },
    {
      id: 15,
      name: "Classic Black Cotton Shirt",
      price: 1199,
      image: shirt15,
      description: "Simple and elegant cotton shirt in classic brown."
    },
    {
      id: 16,
      name: "Sky Blue Casual Shirt",
      price: 1099,
      image: shirt18,
      description: "Soft sky blue shirt made for daily wear."
    },
    {
      id: 17,
      name: "Button Down Oxford Shirt",
      price: 1499,
      image: shirt16,
      description: "Durable Oxford fabric shirt with button-down collar."
    },
    {
      id: 18,
      name: "Classy Shirt",
      price: 1399,
      image: shirt17,
      description: "Modern Classy shirt for evening events."
    },
    
  ],
};

const shirtsSlice = createSlice({
  name: "shirts",
  initialState,
  reducers: {},
});

export default shirtsSlice.reducer;
