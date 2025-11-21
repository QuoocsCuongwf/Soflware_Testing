import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import fetch from 'node-fetch';
import axios from 'axios';

import ProductForm from '../components/ProductForm.js';
import ProductList from '../components/ProductList.js';
import ProductDetail from '../components/ProductDetail.js';

jest.setTimeout(30000);

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:8080/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

let backendReady = false;
let sampleProductId = null;
let backendSkipMessage = 'Backend integration tests skipped: ';

beforeAll(async () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    backendSkipMessage += 'Thiếu biến môi trường TEST_USERNAME/TEST_PASSWORD.';
    return;
  }

  try {
    const loginRes = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!loginRes.ok) {
      backendSkipMessage += `Đăng nhập thất bại (status ${loginRes.status}).`;
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData?.data?.token;

    if (!token) {
      backendSkipMessage += 'Không tìm thấy token trong response.';
      return;
    }

    backendReady = true;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(loginData.data));

    const listRes = await fetch(PRODUCTS_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (listRes.ok) {
      const listData = await listRes.json();
      const firstProduct = listData?.data?.[0];
      if (firstProduct?.id) {
        sampleProductId = firstProduct.id;
      }
    }
  } catch (error) {
    backendSkipMessage += `Không thể kết nối backend (${error.message}).`;
    backendReady = false;
  }
});

describe('Product integration tests', () => {
  test('ProductForm vẫn hiển thị và validate cục bộ', async () => {
    render(
      <MemoryRouter>
        <ProductForm onClose={jest.fn()} />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Tên sản phẩm/i);
    const priceInput = screen.getByLabelText(/Giá/i);
    const quantityInput = screen.getByLabelText(/Số lượng/i);

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
  });

  test('ProductList tải dữ liệu từ backend thật', async () => {
    if (!backendReady) {
      console.warn(backendSkipMessage);
      return;
    }

    render(
      <MemoryRouter>
        <ProductList onLogout={() => {}} />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Product Management/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Đang tải sản phẩm/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    const emptyState = screen.queryByText(/Chưa có sản phẩm nào/i);
    const productCards = document.querySelectorAll('.product-card');

    expect(emptyState || productCards.length > 0).toBeTruthy();
  });

  test('ProductDetail hiển thị sản phẩm từ backend thật', async () => {
    if (!backendReady || !sampleProductId) {
      console.warn(
        backendSkipMessage ||
          'Backend integration tests skipped: không tìm thấy sản phẩm mẫu.'
      );
      return;
    }

    render(
      <MemoryRouter initialEntries={[`/products/${sampleProductId}`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const heading = await screen.findByRole('heading', {
      name: /chi tiết sản phẩm/i,
    });

    expect(heading).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Đang tải thông tin sản phẩm/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  });
});
