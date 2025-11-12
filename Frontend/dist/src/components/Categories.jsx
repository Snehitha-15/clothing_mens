// src/components/Categories.jsx

//reusable component got categories

import React from "react";

const Categories = ({ categories, selected, onSelect }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "15px", padding: "20px 0" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: selected === cat ? "#007bff" : "#f0f0f0",
            color: selected === cat ? "#fff" : "#333",
            fontWeight: selected === cat ? "bold" : "normal",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Categories;
