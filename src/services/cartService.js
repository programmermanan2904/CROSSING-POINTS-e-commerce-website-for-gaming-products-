const API_URL = "http://localhost:5000/api/cart";

const getToken = () => {
  return localStorage.getItem("token");
};

// GET CART
export const getCart = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

// ADD TO CART
export const addToCart = async (product) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    }),
  });

  return res.json();
};

// REMOVE FROM CART
export const removeFromCart = async (productId) => {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const decreaseFromCart = async (productId) => {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
