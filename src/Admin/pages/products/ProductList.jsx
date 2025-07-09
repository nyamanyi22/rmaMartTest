import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ProductList.css'; // Ensure you have this CSS file for styling

const exportToCSV = (products) => {
  if (!products.length) return alert('No products to export.');

  const headers = ['Code', 'Name', 'Brand', 'Category', 'Price', 'Stock'];
  const rows = products.map(p => [
    p.code,
    p.name,
    p.brand,
    p.category,
    p.price,
    p.stock
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
const timestamp = new Date().toISOString().split('T')[0];
link.setAttribute('download', `products_${timestamp}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/admin/products');
        setProducts(response.data);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    [product.name, product.code, product.brand, product.category]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleCreate = () => {
    navigate('/admin/products/create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError('Failed to delete product. Please try again.');
      console.error('Delete failed:', error);
    }
  };
  const [exportMode, setExportMode] = useState('filtered'); // or 'all'
const handleExport = async () => {
  let exportData = [];

  if (exportMode === 'all') {
    try {
      const response = await axios.get('/api/admin/products'); // fetch all products
      exportData = response.data;
    } catch (error) {
      alert('Failed to fetch all products for export.');
      return;
    }
  } else {
    exportData = filteredProducts; // current filtered view
  }

  exportToCSV(exportData); // implement this or use a CSV utility
};


  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Product List</h2>
        <button onClick={handleCreate} className="add-product-btn">
          Add Product
        </button>
      </div>

    <select
  className="export-dropdown"
  value={exportMode}
  onChange={(e) => setExportMode(e.target.value)}
>
  <option value="filtered">Export Filtered Products</option>
  <option value="all">Export All Products</option>
</select>
<button onClick={handleExport}>Export CSV</button>



      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, code, brand, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;