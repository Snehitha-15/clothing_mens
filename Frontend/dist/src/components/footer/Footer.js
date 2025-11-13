import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  const cartItems = useSelector(state => state.cart?.items ?? []);

  return (
    <footer className="footer">
      <div className="footer-top">

        {/* Company Section */}
        <div className="footer-section">
          <h4>Company</h4>
          <Link to="/">About Us</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Careers</Link>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h4>Support</h4>
          <Link to="/">FAQ</Link>
          <Link to="/">Shipping</Link>
          <Link to="/">Returns</Link>
        </div>

        {/* Shop Section */}
        <div className="footer-section">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart ({cartItems.length})</Link>
        </div>

        {/* Follow Us Section (moved up before newsletter) */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h4>Newsletter</h4>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 Men’s Clothing Brand. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
