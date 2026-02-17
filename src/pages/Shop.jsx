import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

const Shop = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL)
      .then(res => {
        console.log("Fetched:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err.response?.data || err.message);
      });
  }, []);

  if (!products.length) {
    return <div className="shop-container">No products available</div>;
  }

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="shop-container">
      {categories.map((category) => {

        const filteredProducts = products.filter(
          (product) =>
            product.category?.toLowerCase() === category?.toLowerCase()
        );

        return (
          <section key={category} className="shop-section">
            <h2 className="shop-heading">
              {category.toUpperCase()}
            </h2>

            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Shop;
