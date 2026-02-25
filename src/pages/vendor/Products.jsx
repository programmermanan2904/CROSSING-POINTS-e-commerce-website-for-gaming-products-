import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ProductImage from "../../components/ProductImage";
import "../../styles/products.css";

export default function Products() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formDataState, setFormDataState] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= FETCH ================= */
  const fetchVendorProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/vendor`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    if (user?.token) fetchVendorProducts();
  }, [user]);

  /* ================= VALIDATION ================= */
  const validateProduct = () => {
    let newErrors = {};

    if (!formDataState.name.trim() || formDataState.name.length < 2)
      newErrors.name = "Product name must be at least 2 characters";

    if (!formDataState.price || isNaN(formDataState.price) || Number(formDataState.price) <= 0)
      newErrors.price = "Price must be a positive number";

    if (!formDataState.category.trim())
      newErrors.category = "Category is required";

    if (formDataState.stock === "" || isNaN(formDataState.stock) || Number(formDataState.stock) < 0)
      newErrors.stock = "Stock must be 0 or more";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setFormDataState({
      ...formDataState,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProduct()) return;

    try {
      const formData = new FormData();
      formData.append("name", formDataState.name);
      formData.append("price", formDataState.price);
      formData.append("category", formDataState.category);
      formData.append("description", formDataState.description);
      formData.append("stock", formDataState.stock);
      if (image) formData.append("image", image);

      if (editingProduct) {
        await axios.put(
          `${API_URL}/api/products/${editingProduct._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
      }

      resetForm();
      fetchVendorProducts();

    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Operation failed",
      });
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setFormDataState({
      name: "",
      price: "",
      category: "",
      description: "",
      stock: "",
    });
    setImage(null);
    setEditingProduct(null);
    setShowForm(false);
    setErrors({});
  };

  /* ================= EDIT ================= */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormDataState({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
    });
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchVendorProducts();
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">My Products</h2>
        <button
          className="add-product-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
          }}
        >
          {showForm ? "Close" : "+ Add Product"}
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="add-product-wrapper">
          <form className="add-product-form" onSubmit={handleSubmit}>
            {errors.api && <p className="error">{errors.api}</p>}

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formDataState.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formDataState.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error">{errors.price}</span>}

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formDataState.category}
              onChange={handleChange}
            />
            {errors.category && <span className="error">{errors.category}</span>}

            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formDataState.stock}
              onChange={handleChange}
            />
            {errors.stock && <span className="error">{errors.stock}</span>}

            <textarea
              name="description"
              placeholder="Description"
              value={formDataState.description}
              onChange={handleChange}
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button type="submit">
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
          </form>
        </div>
      )}

      {/* ================= PRODUCTS GRID ================= */}
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="vendor-product-card">
              <div className="card-content">

                {product.image && (
                  <div className="product-image-wrapper">
                    <ProductImage
                      publicId={product.image}
                      alt={product.name}
                    />
                  </div>
                )}

                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
                <p className="category">{product.category}</p>
                <p>Stock: {product.stock}</p>
              </div>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#aaa" }}>No products found.</p>
        )}
      </div>
    </div>
  );
}