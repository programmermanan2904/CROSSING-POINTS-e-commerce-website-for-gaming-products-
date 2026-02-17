import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/products.css";

export default function Products() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH PRODUCTS =================
  const fetchVendorProducts = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user?.token) fetchVendorProducts();
  }, [user]);

  // ================= ADD PRODUCT =================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await axios.post(
        import.meta.env.VITE_API_URL,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Reset form
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImage(null);
      setShowForm(false);

      fetchVendorProducts();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `import.meta.env.VITE_API_URL${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      fetchVendorProducts();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div className="products-container">

      {/* HEADER */}
      <div className="products-header">
        <h2 className="products-title">My Products</h2>
        <button
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Add Product"}
        </button>
      </div>

      {/* EXPANDABLE FORM */}
      {showForm && (
        <div className="add-product-wrapper">
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button type="submit">Save Product</button>
          </form>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="vendor-product-card">

            <div className="card-content">
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <p className="category">{product.category}</p>
            </div>

            <div className="card-actions">
              <button
                className="delete-btn"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
