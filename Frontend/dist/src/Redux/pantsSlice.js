import { createSlice } from "@reduxjs/toolkit";

// Import pant images
import pant1 from "../assets/images/pants/pant1.jpg";
import pant2 from "../assets/images/pants/pant2.jpg";
import pant3 from "../assets/images/pants/pant3.jpg";
import pant4 from "../assets/images/pants/pant4.jpg";
import pant5 from "../assets/images/pants/pant5.jpg";
import pant6 from "../assets/images/pants/pant6.jpg";
import pant7 from "../assets/images/pants/pant7.jpg";
import pant8 from "../assets/images/pants/pant8.jpg";
import pant9 from "../assets/images/pants/pant9.jpg";
import pant10 from "../assets/images/pants/pant10.jpg";
import pant11 from "../assets/images/pants/pant11.jpg";
import pant12 from "../assets/images/pants/pant12.jpg";
import pant13 from "../assets/images/pants/pant13.jpg";
import pant14 from "../assets/images/pants/pant14.jpg";
import pant15 from "../assets/images/pants/pant15.jpg";
import pant16 from "../assets/images/pants/pant16.jpg";
import pant17 from "../assets/images/pants/pant17.jpg";
import pant18 from "../assets/images/pants/pant18.jpg";

const initialState = {
  pants: [
    {
      id: 1,
      name: "Slim Fit Jeans",
      price: 1499,
      image: pant1,
      description: "Classic slim fit jeans for a modern and stylish look."
    },
    {
      id: 2,
      name: "Cotton Chinos",
      price: 1299,
      image: pant2,
      description: "Soft cotton chinos perfect for office or casual wear."
    },
    {
      id: 3,
      name: "Cargo Pants",
      price: 1599,
      image: pant3,
      description: "Comfortable cargo pants with multiple utility pockets."
    },
    {
      id: 4,
      name: "Formal Trousers",
      price: 1799,
      image: pant4,
      description: "Elegant formal trousers designed for business meetings."
    },
    {
      id: 5,
      name: "Denim Jeans",
      price: 1399,
      image: pant5,
      description: "Durable denim jeans with a premium finish."
    },
    {
      id: 6,
      name: "Track Pants",
      price: 999,
      image: pant6,
      description: "Comfortable track pants perfect for workouts or lounging."
    },
    {
      id: 7,
      name: "Slim Tapered Jeans",
      price: 1599,
      image: pant7,
      description: "Tapered jeans offering a sleek and smart appearance."
    },
    {
      id: 8,
      name: "Linen Pants",
      price: 1699,
      image: pant8,
      description: "Breathable linen pants ideal for summer comfort."
    },
    {
      id: 9,
      name: "Joggers",
      price: 1199,
      image: pant9,
      description: "Stylish joggers made with premium cotton fabric."
    },
    {
      id: 10,
      name: "Relaxed Fit Jeans",
      price: 1499,
      image: pant10,
      description: "Relaxed fit jeans for maximum comfort and mobility."
    },
    {
      id: 11,
      name: "Khaki Pants",
      price: 1299,
      image: pant11,
      description: "Classic khaki pants suitable for any occasion."
    },
    {
      id: 12,
      name: "Slim Fit Formal Pants",
      price: 1799,
      image: pant12,
      description: "Perfectly tailored slim-fit pants for formal events."
    },
    {
      id: 13,
      name: "Stretchable Jeans",
      price: 1599,
      image: pant13,
      description: "Comfortable stretchable jeans for all-day wear."
    },
    {
      id: 14,
      name: "Casual Shorts",
      price: 999,
      image: pant14,
      description: "Light and stylish shorts for a cool summer look."
    },
    {
      id: 15,
      name: "Athletic Pants",
      price: 1399,
      image: pant15,
      description: "Flexible and durable pants designed for active use."
    },
    {
      id: 16,
      name: "Twill Trousers",
      price: 1499,
      image: pant16,
      description: "Soft twill trousers with a refined finish for smart casual wear."
    },
    {
      id: 17,
      name: "Washed Blue Jeans",
      price: 1599,
      image: pant17,
      description: "Washed blue jeans giving a trendy and rugged appearance."
    },
    {
      id: 18,
      name: "Corduroy Pants",
      price: 1699,
      image: pant18,
      description: "Classic corduroy pants perfect for a premium vintage look."
    },
  ],
};

const pantsSlice = createSlice({
  name: "pants",
  initialState,
  reducers: {},
});

export default pantsSlice.reducer;
