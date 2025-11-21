import React, { useState, useEffect } from 'react';
import productService from '../services/productService.js';
import { 
  validateProductName, 
  validatePrice, 
  validateQuantity 
} from '../utils/validation.js';
import './ProductForm.css';

/**
 * ProductForm Component - Form thêm/sửa sản phẩm
 */
function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
    isAvailable: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateProductName(formData.name);
    if (nameError) newErrors.name = nameError;

    const priceError = validatePrice(formData.price);
    if (priceError) newErrors.price = priceError;

    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) newErrors.quantity = quantityError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (product) {
        await productService.updateProduct(product.id, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await productService.createProduct(productData);
        alert('Thêm sản phẩm thành công!');
      }
      
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>{product ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product-name">Tên sản phẩm *</label>
            <input
              id="product-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              disabled={loading}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="product-description">Mô tả</label>
            <textarea
              id="product-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-price">Giá (VNĐ) *</label>
              <input
                id="product-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
              {errors.price && <div className="error">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="product-quantity">Số lượng *</label>
              <input
                id="product-quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
              {errors.quantity && <div className="error">{errors.quantity}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="product-category">Danh mục</label>
            <input
              id="product-category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="VD: Electronics, Fashion, Food..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-image-url">URL hình ảnh</label>
            <input
              id="product-image-url"
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="product-available">
              <input
                id="product-available"
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                disabled={loading}
              />
              Sản phẩm có sẵn
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (product ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
