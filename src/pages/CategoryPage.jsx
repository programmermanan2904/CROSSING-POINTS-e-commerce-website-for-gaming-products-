import { useParams } from "react-router-dom";
import products from "../data/products";
import "../styles/CategoryProducts.css";

function CategoryProducts() {
  const { name } = useParams();

  // normalize category name
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === name.toLowerCase()
  );

  if (!filteredProducts.length) {
    return (
      <div className="category-container">
        <h2 className="category-title">
          No products found in "{name}"
        </h2>
      </div>
    );
  }

  return (
    <div className="category-container">
      <h2 className="category-title">
        {name.toUpperCase()}
      </h2>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />

            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>

            <button className="add-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;