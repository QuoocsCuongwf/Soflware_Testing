import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService.js';
import { formatCurrency } from '../utils/validation.js';
import './ProductDetail.css';

/**
 * ProductDetail Component - Hiển thị chi tiết sản phẩm
 */
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      if (response.success) {
        setProduct(response.data);
        setError(null);
      } else {
        setError('Không tìm thấy sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [loadProduct]);

  const handleBack = () => {
    navigate('/products');
  };

  const handleEdit = () => {
    navigate('/products', { state: { editProduct: product } });
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        alert('Xóa sản phẩm thành công!');
        navigate('/products');
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm!');
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
          <button className="btn btn-primary" onClick={handleBack}>
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={handleBack}>
          ← Quay lại
        </button>
        <h1>Chi tiết sản phẩm</h1>
      </div>

      <div className="detail-content card">
        <div className="detail-image-section">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="detail-image" />
          ) : (
            <div className="detail-no-image">
              <p>Không có hình ảnh</p>
            </div>
          )}
        </div>

        <div className="detail-info-section">
          <div className="detail-header-info">
            <h2>{product.name}</h2>
            {product.category && (
              <span className="detail-category">{product.category}</span>
            )}
          </div>

          <div className="detail-price-section">
            <div className="price-box">
              <label>Giá bán</label>
              <h3 className="detail-price">{formatCurrency(product.price)}</h3>
            </div>
            <div className="quantity-box">
              <label>Tồn kho</label>
              <p className={`detail-quantity ${product.quantity < 10 ? 'low-stock' : ''}`}>
                {product.quantity} sản phẩm
                {product.quantity < 10 && <span className="low-stock-badge">⚠️ Sắp hết</span>}
              </p>
            </div>
          </div>

          <div className="detail-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description || 'Không có mô tả'}</p>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Mã sản phẩm:</span>
              <span className="meta-value">#{product.id}</span>
            </div>
            {product.createdAt && (
              <div className="meta-item">
                <span className="meta-label">Ngày tạo:</span>
                <span className="meta-value">
                  {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            )}
            {product.updatedAt && (
              <div className="meta-item">
                <span className="meta-label">Cập nhật:</span>
                <span className="meta-value">
                  {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            )}
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={handleEdit}>
              Chỉnh sửa
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
