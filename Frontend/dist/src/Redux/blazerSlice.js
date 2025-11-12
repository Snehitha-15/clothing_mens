import { createSlice } from "@reduxjs/toolkit";

import blazer1 from "../assets/images/Blazer/blazer1.jpg";
import blazer2 from "../assets/images/Blazer/blazer2.jpg";
import blazer3 from "../assets/images/Blazer/blazer3.jpg";
import blazer4 from "../assets/images/Blazer/blazer4.jpg";
import blazer5 from "../assets/images/Blazer/blazer5.jpg";
import blazer6 from "../assets/images/Blazer/blazer6.jpg";
import blazer7 from "../assets/images/Blazer/blazer7.jpg";
import blazer8 from "../assets/images/Blazer/blazer8.jpg";
import blazer9 from "../assets/images/Blazer/blazer9.jpg";
import blazer10 from "../assets/images/Blazer/blazer10.jpg";
import blazer11 from "../assets/images/Blazer/blazer11.jpg";
import blazer12 from "../assets/images/Blazer/blazer12.jpg";
import blazer13 from "../assets/images/Blazer/blazer13.jpg";
import blazer14 from "../assets/images/Blazer/blazer14.jpg";
import blazer15 from "../assets/images/Blazer/blazer15.jpg";
import blazer16 from "../assets/images/Blazer/blazer16.jpg";
import blazer17 from "../assets/images/Blazer/blazer17.jpg";

const initialState = {
  blazers: [
    {
      id: 1,
      name: "Classic Black Blazer",
      price: 2999,
      image: blazer1,
      description: "Timeless black blazer with premium wool blend and perfect fit."
    },
    {
      id: 2,
      name: "Royal Blue Blazer",
      price: 2799,
      image: blazer2,
      description: "Elegant blue blazer ideal for parties and formal events."
    },
    {
      id: 3,
      name: "Checked Grey Blazer",
      price: 2899,
      image: blazer3,
      description: "Trendy checkered pattern for a sophisticated appearance."
    },
    {
      id: 4,
      name: "Slim Fit Brown Blazer",
      price: 2599,
      image: blazer4,
      description: "Comfortable slim-fit design for a smart, tailored look."
    },
    {
      id: 5,
      name: "Navy Office Blazer",
      price: 2499,
      image: blazer5,
      description: "Perfect for office wear with a professional finish."
    },
    {
      id: 6,
      name: "Velvet Party Blazer",
      price: 3199,
      image: blazer6,
      description: "Luxurious velvet material with soft inner lining."
    },
    {
      id: 7,
      name: "Cream Wedding Blazer",
      price: 3499,
      image: blazer7,
      description: "Elegant cream shade blazer perfect for weddings and occasions."
    },
    {
      id: 8,
      name: "Charcoal Grey Formal Blazer",
      price: 2899,
      image: blazer8,
      description: "Formal blazer with fine texture for business or events."
    },
    {
      id: 9,
      name: "Textured Wine Blazer",
      price: 3299,
      image: blazer9,
      description: "Unique textured design in a rich wine shade."
    },
    {
      id: 10,
      name: "Casual Cotton Blazer",
      price: 2399,
      image: blazer10,
      description: "Lightweight cotton blazer perfect for casual meetings."
    },
    {
      id: 11,
      name: "Beige Linen Blazer",
      price: 2599,
      image: blazer11,
      description: "Comfortable linen fabric ideal for summer formals."
    },
    {
      id: 12,
      name: "Classic Grey Blazer",
      price: 2799,
      image: blazer12,
      description: "Minimalist grey blazer that goes with any shirt style."
    },
    {
      id: 13,
      name: "Double Breasted Blazer",
      price: 3199,
      image: blazer13,
      description: "Modern double-breasted cut for a classy appeal."
    },
    {
      id: 14,
      name: "Maroon Formal Blazer",
      price: 2699,
      image: blazer14,
      description: "Elegant maroon blazer with a stylish modern finish."
    },
    {
      id: 15,
      name: "Textured Navy Blazer",
      price: 2999,
      image: blazer15,
      description: "Navy textured blazer that complements formal attire."
    },
    {
      id: 16,
      name: "Olive Green Blazer",
      price: 2899,
      image: blazer16,
      description: "Trendy olive shade blazer for stylish outings."
    },
    {
      id: 17,
      name: "Party Wear Blazer",
      price: 3099,
      image: blazer17,
      description: "Stylish party blazer designed to stand out at events."
    },
       {
      id: 18,
      name: "Party Wear Blazer",
      price: 3099,
      image: blazer1,
      description: "Stylish party blazer designed to stand out at events."
    },
  ],
};

const blazerSlice = createSlice({
  name: "blazers",
  initialState,
  reducers: {},
});

export default blazerSlice.reducer;
