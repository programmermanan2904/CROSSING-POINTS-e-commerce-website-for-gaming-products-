import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => {
        console.log("SHOP PRODUCTS:", res.data); // Debug safely inside component
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="shop-container">Loading...</div>;
  }

  const categories = [
    ...new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="shop-container">
      {categories.map((category) => {
        const filteredProducts = products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        );

        const sectionId = category.toLowerCase().replace(/\s+/g, "");

        return (
          <section
            key={category}
            id={sectionId}
            className="shop-section"
          >
            <h2 className="shop-heading">
              {category.toUpperCase()}
            </h2>

            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </section>
        );
      })}

      {categories.length === 0 && (
        <div>No products available</div>
      )}
    </div>
  );
};

export default Shop;