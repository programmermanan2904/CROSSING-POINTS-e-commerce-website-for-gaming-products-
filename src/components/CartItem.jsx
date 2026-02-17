import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />

      <div className="cart-info">
        <h4>{item.name}</h4>
        <p>₹{item.price}</p>
      </div>

      <div className="cart-controls">
        <button onClick={() => updateQty(item.productId, item.quantity - 1)}>
          −
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQty(item.productId, item.quantity + 1)}>
          +
        </button>
      </div>

      <button
        className="remove-btn"
        onClick={() => removeItem(item.productId)}
      >
        Remove
      </button>
    </div>
  );
}
