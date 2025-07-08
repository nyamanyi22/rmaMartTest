import PropTypes from 'prop-types';
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-3 py-1 rounded transition 
            ${i === currentPage 
              ? 'bg-blue-600 text-white font-medium' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="mx-1 p-1 border rounded disabled:opacity-50"
        aria-label="First page"
      >
        <HiChevronDoubleLeft />
      </button>

      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="mx-1 p-1 border rounded disabled:opacity-50"
        aria-label="Previous page"
      >
        <HiChevronLeft />
      </button>

      {getPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="mx-1 p-1 border rounded disabled:opacity-50"
        aria-label="Next page"
      >
        <HiChevronRight />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="mx-1 p-1 border rounded disabled:opacity-50"
        aria-label="Last page"
      >
        <HiChevronDoubleRight />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
