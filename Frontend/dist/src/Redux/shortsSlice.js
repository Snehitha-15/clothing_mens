import { createSlice } from "@reduxjs/toolkit";

// ✅ Import Shorts images
import shorts1 from "../assets/images/shorts/short1.jpg";
import shorts2 from "../assets/images/shorts/short2.jpg";
import shorts3 from "../assets/images/shorts/short3.jpg";
import shorts4 from "../assets/images/shorts/short4.jpg";
import shorts5 from "../assets/images/shorts/short5.jpg";
import shorts6 from "../assets/images/shorts/short6.jpg";
import shorts7 from "../assets/images/shorts/short7.jpg";
import shorts8 from "../assets/images/shorts/short8.jpg";
import shorts9 from "../assets/images/shorts/short9.jpg";
import shorts10 from "../assets/images/shorts/short10.jpg";
import shorts11 from "../assets/images/shorts/short11.jpg";
import shorts12 from "../assets/images/shorts/short12.jpg";
import shorts13 from "../assets/images/shorts/short13.jpg";
import shorts14 from "../assets/images/shorts/short14.jpg";
import shorts15 from "../assets/images/shorts/short15.jpg";
import shorts16 from "../assets/images/shorts/short16.jpg";
import shorts17 from "../assets/images/shorts/short17.jpg";
import shorts18 from "../assets/images/shorts/short18.jpg";

// ✅ Shorts data
const initialState = {
  shorts: [
    { id: 1, name: "Casual Cotton Shorts", price: 799, image: shorts1, description: "Comfortable cotton shorts for everyday wear." },
    { id: 2, name: "Denim Shorts", price: 899, image: shorts2, description: "Classic blue denim shorts with a modern fit." },
    { id: 3, name: "Chino Shorts", price: 949, image: shorts3, description: "Smart chino-style shorts for a semi-casual look." },
    { id: 4, name: "Sports Shorts", price: 699, image: shorts4, description: "Breathable shorts for running and workouts." },
    { id: 5, name: "Cargo Shorts", price: 1099, image: shorts5, description: "Utility cargo shorts with multiple pockets." },
    { id: 6, name: "Drawstring Lounge Shorts", price: 749, image: shorts6, description: "Relaxed fit lounge shorts with elastic waist." },
    { id: 7, name: "Striped Shorts", price: 849, image: shorts7, description: "Stylish striped shorts for casual outings." },
    { id: 8, name: "Slim Fit Shorts", price: 899, image: shorts8, description: "Modern slim fit shorts with clean lines." },
    { id: 9, name: "Printed Beach Shorts", price: 999, image: shorts9, description: "Bright printed shorts perfect for beach or pool." },
    { id: 10, name: "Plain Black Shorts", price: 799, image: shorts10, description: "Minimalist black shorts for versatile styling." },
    { id: 11, name: "Checked Shorts", price: 899, image: shorts11, description: "Classic checked pattern shorts for casual style." },
    { id: 12, name: "Denim Ripped Shorts", price: 1099, image: shorts12, description: "Trendy ripped denim shorts for modern look." },
    { id: 13, name: "Linen Shorts", price: 849, image: shorts13, description: "Lightweight linen shorts for summer comfort." },
    { id: 14, name: "Solid Blue Shorts", price: 799, image: shorts14, description: "Simple solid blue shorts for daily wear." },
    { id: 15, name: "Sports Mesh Shorts", price: 699, image: shorts15, description: "Breathable mesh shorts for active wear." },
    { id: 16, name: "Cargo Utility Shorts", price: 1099, image: shorts16, description: "Heavy-duty cargo shorts with extra pockets." },
    { id: 17, name: "Retro Printed Shorts", price: 999, image: shorts17, description: "Retro-style printed shorts for a bold look." },
    { id: 18, name: "Plain White Shorts", price: 799, image: shorts18, description: "Minimalist white shorts for versatile outfits." },
  ],
};

// ✅ Create Slice
const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {},
});

// ✅ Export reducer
export default shortsSlice.reducer;
