import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseItem = (id) => {
    const exist = cart.find((item) => item._id === id);

    if (exist.quantity === 1) {
      removeItem(id);
    } else {
      setCart(
        cart.map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,   // 🔥 IMPORTANT: Now Checkout can clear cart
        addItem,
        decreaseItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
