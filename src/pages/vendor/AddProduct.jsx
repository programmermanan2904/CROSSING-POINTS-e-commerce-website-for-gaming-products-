import { useState } from "react";
import Sidebar from "../../components/vendor/Sidebar";

const AddProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="vendor-layout">
      <Sidebar />

      <div className="vendor-content">
        <div className="vendor-form-card">
          <h1>Add Product</h1>

          <form className="vendor-form">
            <input type="text" placeholder="Store / Company Name" />

            <input type="text" placeholder="Product Name" />

            <input type="number" placeholder="Price" />

            <textarea placeholder="Product Description"></textarea>

            <label className="upload-label">
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}

            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
