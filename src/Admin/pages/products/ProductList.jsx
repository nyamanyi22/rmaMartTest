import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { fetchProducts } from '../../api/productService'; // Adjust path if needed

import './styles/ProductList.css'; // Ensure you have this CSS file for styling

const exportToCSV = (products) => {
  if (!products.length) {
    console.log('No products to export.'); // Replaced alert
    // You might show a custom message modal here
    return;
  }

  const headers = ['Code', 'Name', 'Brand', 'Category', 'Stock'];
  const rows = products.map(p => [
    p.code,
    p.name,
    p.brand,
    p.category,
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
  URL.revokeObjectURL(url); // Clean up the URL object
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 10; // Number of items to display per page

  const navigate = useNavigate();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Assuming fetchProducts() returns an array of ALL products for client-side pagination
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    [product.name, product.code, product.brand, product.category]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination values based on filtered products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]); // totalPages is a dependency because it defines the valid range

  // Navigation handlers
  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleCreate = () => {
    navigate('/admin/products/create');
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    // Replace window.confirm with a custom modal for better UX
    console.log(`Confirm deletion for product ID: ${id}`);
    // Example: showCustomConfirmModal('Are you sure you want to delete this product?', async () => {
    try {
      // Assuming axios.delete returns a successful status
      await axios.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((product) => product.id !== id)); // Remove deleted product from state
      console.log(`Product ${id} deleted successfully.`);
    } catch (error) {
      setError('Failed to delete product. Please try again.');
      console.error('Delete failed:', error);
    }
    // });
  };

  const [exportMode, setExportMode] = useState('filtered');

  const handleExport = async () => {
    let exportData = [];

    if (exportMode === 'all') {
      try {
        // Fetch ALL products directly from API for 'all' export
        const response = await axios.get('/api/admin/products');
        exportData = response.data;
      } catch (error) {
        console.error('Failed to fetch all products for export:', error);
        setError('Failed to fetch all products for export.'); // Set error state
        return;
      }
    } else {
      exportData = filteredProducts; // Use currently filtered products
    }

    exportToCSV(exportData);
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Product List</h2>
        <button onClick={handleCreate} className="add-product-btn btn">
          Add Product
        </button>
      </div>

      <div className="search-filter-section"> {/* Wrapper for search and export controls */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, code, brand, category..."
            value={searchQuery}
            onChange={(e) => setCurrentPage(1) || setSearchQuery(e.target.value)} // Reset page on search
          />
        </div>

        <select
          className="export-dropdown"
          value={exportMode}
          onChange={(e) => setExportMode(e.target.value)}
        >
          <option value="filtered">Export Filtered Products</option>
          <option value="all">Export All Products</option>
        </select>
        <button onClick={handleExport} className="btn">Export CSV</button>
      </div>

      {error && <div className="error-message">{error}</div>}

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
                      <td>{product.stock}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="edit-btn btn" // Added 'btn' class
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="delete-btn btn" // Added 'btn' class
                          >
                            Delete
                          </button>
                        </div>
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

          {/* Pagination Section */}
          {/* Temporarily removed totalPages > 1 condition for debugging */}
          {/* Re-add this condition once you confirm pagination works with more data */}
          {/* {totalPages > 1 && ( */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading} // Disable while loading
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                  disabled={isLoading} // Disable while loading
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading} // Disable while loading
            >
              Next
            </button>
          </div>
          {/* )} */}
          {/* Results Count Display */}
          {filteredProducts.length > 0 && (
            <div className="results-count">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;