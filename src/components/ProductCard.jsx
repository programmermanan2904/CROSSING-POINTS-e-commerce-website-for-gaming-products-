import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import "../styles/productcard.css";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dv251twzd",
  },
});

function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem(product);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // 🔥 NO CROPPING, NO RESIZE
  const img = product.image ? cld.image(product.image) : null;

  return (
    <div className="product-card">

      {/* Badge */}
      {isOutOfStock && <span className="badge out">Out of Stock</span>}
      {isLowStock && <span className="badge low">Low Stock</span>}

      {/* Image Section */}
      <div className="image-container">
        {img && (
          <AdvancedImage
            cldImg={img}
            className="product-image"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="card-body">
        <h3 className="product-name">{product.name}</h3>

        <p className="price">₹{product.price}</p>

        {!isOutOfStock && (
          <p className="stock-text">{product.stock} left</p>
        )}

        <button
          className={`add-btn ${isOutOfStock ? "disabled" : ""}`}
          onClick={handleAdd}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;