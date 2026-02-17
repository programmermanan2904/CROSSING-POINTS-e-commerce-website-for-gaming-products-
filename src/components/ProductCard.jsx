import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/productcard.css";

function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  const handleAdd = () => {
    addItem(product);
  };

  return (
    <div className="product-card">
      <img
  src={`import.meta.env.VITE_API_URL${product.image}`}
  alt={product.name}
/>

      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <button className="add-btn" onClick={handleAdd}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;