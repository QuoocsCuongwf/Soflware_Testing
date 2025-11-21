import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import productService from '../services/productService.js';
import authService from '../services/authService.js';
import ProductForm from './ProductForm.js';
import { formatCurrency } from '../utils/validation.js';
import './ProductList.css';

/**
 * ProductList Component - Component danh sách sản phẩm
 */
function ProductList({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadProducts();
    
    // Nếu có state editProduct từ ProductDetail, mở form edit
    if (location.state?.editProduct) {
      setEditingProduct(location.state.editProduct);
      setShowForm(true);
      // Clear state để tránh mở lại form khi reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }
    try {
      const response = await productService.searchProducts(searchTerm);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm!');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h1>Product Management</h1>
        <div className="user-info">
          <span>Xin chào, <strong>{currentUser?.username}</strong></span>
          <button className="btn btn-secondary" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Search and Add Section */}
        <div className="actions-bar card">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>
          <button 
            className="btn btn-success"
            onClick={() => setShowForm(true)}
          >
            Thêm sản phẩm
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="loading">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>Chưa có sản phẩm nào</h2>
            <p>Hãy thêm sản phẩm đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div 
                key={product.id} 
                className="product-card card fade-in"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category || 'Không phân loại'}</p>
                  <p className="description">{product.description}</p>
                  <div className="product-details">
                    <span className="price">{formatCurrency(product.price)}</span>
                    <span className="quantity">Còn lại: {product.quantity}</span>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
