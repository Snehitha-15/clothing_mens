// src/Redux/suitSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Import Suit images (replace these with your actual images)
import suit1 from "../assets/images/suits/suit1.jpg";
import suit2 from "../assets/images/suits/suit2.jpg";
import suit3 from "../assets/images/suits/suit3.jpg";
import suit4 from "../assets/images/suits/suit4.jpg";
import suit5 from "../assets/images/suits/suit5.jpg";
import suit6 from "../assets/images/suits/suit6.jpg";
import suit7 from "../assets/images/suits/suit7.jpg";
import suit8 from "../assets/images/suits/suit8.jpg";
import suit9 from "../assets/images/suits/suit9.jpg";
import suit10 from "../assets/images/suits/suit10.jpg";
import suit11 from "../assets/images/suits/suit11.jpg";
import suit12 from "../assets/images/suits/suit12.jpg";
import suit13 from "../assets/images/suits/suit13.jpg";
import suit14 from "../assets/images/suits/suit14.jpg";
import suit15 from "../assets/images/suits/suit15.jpg";
import suit16 from "../assets/images/suits/suit16.jpg";
import suit17 from "../assets/images/suits/suit17.jpg";
import suit18 from "../assets/images/suits/suit18.jpg";

// ✅ Initial state with 18 sample suits
const initialState = {
  suits: [
    { id: 1, name: "Classic Black Suit", price: 4999, image: suit1, description: "Elegant black suit perfect for formal events." },
    { id: 2, name: "Navy Blue Suit", price: 5299, image: suit2, description: "Stylish navy blue suit with slim fit design." },
    { id: 3, name: "Grey Pinstripe Suit", price: 5599, image: suit3, description: "Professional grey pinstripe suit for office wear." },
    { id: 4, name: "Charcoal Suit", price: 4799, image: suit4, description: "Comfortable charcoal suit with modern cut." },
    { id: 5, name: "Light Grey Suit", price: 4999, image: suit5, description: "Light grey suit ideal for daytime events." },
    { id: 6, name: "Beige Suit", price: 5199, image: suit6, description: "Classic beige suit for summer occasions." },
    { id: 7, name: "Double Breasted Black Suit", price: 5999, image: suit7, description: "Double-breasted black suit for a bold look." },
    { id: 8, name: "Slim Fit Blue Suit", price: 5399, image: suit8, description: "Modern slim fit blue suit with sharp style." },
    { id: 9, name: "Three Piece Grey Suit", price: 6299, image: suit9, description: "Three-piece grey suit with waistcoat included." },
    { id: 10, name: "Black Velvet Suit", price: 6999, image: suit10, description: "Luxurious black velvet suit for evening events." },
    { id: 11, name: "Navy Tuxedo", price: 7499, image: suit11, description: "Elegant navy tuxedo for formal parties." },
    { id: 12, name: "Grey Herringbone Suit", price: 5599, image: suit12, description: "Textured grey herringbone suit with modern fit." },
    { id: 13, name: "Charcoal Slim Fit Suit", price: 5199, image: suit13, description: "Smart charcoal slim fit suit for office meetings." },
    { id: 14, name: "Light Blue Suit", price: 4799, image: suit14, description: "Casual light blue suit ideal for semi-formal events." },
    { id: 15, name: "Patterned Grey Suit", price: 5399, image: suit15, description: "Grey suit with subtle pattern for a stylish look." },
    { id: 16, name: "Classic Brown Suit", price: 4999, image: suit16, description: "Brown suit suitable for daily office wear." },
    { id: 17, name: "Black Tuxedo with Satin", price: 7999, image: suit17, description: "Formal black tuxedo with satin lapels." },
    { id: 18, name: "Beige Linen Suit", price: 5599, image: suit18, description: "Lightweight linen suit for summer weddings." },
  ],
};

// ✅ Create Slice
const suitsSlice = createSlice({
  name: "suits",
  initialState,
  reducers: {},
});

// ✅ Export reducer
export default suitsSlice.reducer;
