import { createSlice } from "@reduxjs/toolkit";

import jacket1 from "../assets/images/jackets/jacket1.jpg";
import jacket2 from "../assets/images/jackets/jacket2.jpg";
import jacket3 from "../assets/images/jackets/jacket3.jpg";
import jacket4 from "../assets/images/jackets/jacket4.jpg";
import jacket5 from "../assets/images/jackets/jacket5.jpg";
import jacket6 from "../assets/images/jackets/jacket6.jpg";
import jacket7 from "../assets/images/jackets/jacket7.jpg";
import jacket8 from "../assets/images/jackets/jacket8.jpg";
import jacket9 from "../assets/images/jackets/jacket9.jpg";
import jacket10 from "../assets/images/jackets/jacket10.jpg";
import jacket11 from "../assets/images/jackets/jacket11.jpg";
import jacket12 from "../assets/images/jackets/jacket12.jpg";
import jacket13 from "../assets/images/jackets/jacket13.jpg";
import jacket14 from "../assets/images/jackets/jacket14.jpg";
import jacket15 from "../assets/images/jackets/jacket15.jpg";

import jacket17 from "../assets/images/jackets/jacket17.jpg";
import jacket18 from "../assets/images/jackets/jacket18.jpg";

const initialState = {
  jackets: [
    {
      id: 1,
      name: "Classic Leather Jacket",
      price: 2999,
      image: jacket1,
      description: "Premium leather jacket with soft inner lining for comfort."
    },
    {
      id: 2,
      name: "Denim Blue Jacket",
      price: 2499,
      image: jacket2,
      description: "Trendy denim jacket perfect for casual outings."
    },
    {
      id: 3,
      name: "Puffer Winter Jacket",
      price: 2799,
      image: jacket3,
      description: "Warm puffer jacket ideal for cold winters."
    },
    {
      id: 4,
      name: "Bomber Jacket",
      price: 2599,
      image: jacket4,
      description: "Stylish bomber jacket for a smart casual look."
    },
    {
      id: 5,
      name: "Hooded Sweat Jacket",
      price: 2299,
      image: jacket5,
      description: "Casual hooded jacket made from premium cotton blend."
    },
    {
      id: 6,
      name: "Faux Leather Moto Jacket",
      price: 3199,
      image: jacket6,
      description: "Biker-style faux leather jacket for a bold look."
    },
    {
      id: 7,
      name: "Windbreaker Jacket",
      price: 2199,
      image: jacket7,
      description: "Lightweight windbreaker to protect from chilly winds."
    },
    {
      id: 8,
      name: "Slim Fit Blazer Jacket",
      price: 2799,
      image: jacket8,
      description: "Elegant blazer-style jacket for semi-formal occasions."
    },
    {
      id: 9,
      name: "Suede Brown Jacket",
      price: 2999,
      image: jacket9,
      description: "Soft suede jacket with a luxurious finish."
    },
    {
      id: 10,
      name: "Navy Quilted Jacket",
      price: 2699,
      image: jacket10,
      description: "Quilted design for extra warmth and premium appeal."
    },
    {
      id: 11,
      name: "Camouflage Army Jacket",
      price: 2399,
      image: jacket11,
      description: "Military-inspired camouflage jacket for a rugged look."
    },
    {
      id: 12,
      name: "Trench Coat Style Jacket",
      price: 3499,
      image: jacket12,
      description: "Long trench-style jacket for classy winter styling."
    },
    {
      id: 13,
      name: "Grey Wool Blend Jacket",
      price: 3199,
      image: jacket13,
      description: "Warm wool blend jacket designed for urban fashion."
    },
    {
      id: 14,
      name: "Sports Zip-Up Jacket",
      price: 1999,
      image: jacket14,
      description: "Comfortable sports jacket ideal for outdoor activities."
    },
    {
      id: 15,
      name: "Classic Black Blazer Jacket",
      price: 2899,
      image: jacket15,
      description: "Timeless black blazer for formal and party wear."
    },
    {
        id: 16,
        name: "Classy Jacket",
        price: 2000,
        image: jacket1,
        description: "Comfortable Jacket wear for outings. "
    },
    {
      id: 17,
      name: "Classic Blazer Jacket",
      price: 2899,
      image: jacket17,
      description: " party wear jacket for occations."
    },
    {
      id: 18,
      name: "Trendy Jacket Wear",
      price: 2000,
      image:jacket18,
      description: "Comfortable Jacket wear for Dates. "
    }
  ],
};

const jacketsSlice = createSlice({
  name: "jackets",
  initialState,
  reducers: {},
});

export default jacketsSlice.reducer;
