import React from 'react';
import { Button, Form } from 'react-bootstrap';

function PaginationControls({ currentPage, totalPages, entriesPerPage, setEntriesPerPage, setCurrentPage }) {
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
      };
    
      const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
      };
  
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Select
          data-testid="entries-per-page"
          style={{ width: 'auto' }}
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when page size changes
          }}
        >
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
          <option value={30}>Show 30</option>
        </Form.Select>
      
        <div>
          <Button
            className="me-2"
            variant="outline-secondary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            className="ms-2"
            variant="outline-secondary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  
  export default PaginationControls;