import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchCatches } from '../../utils/api';
import { Form } from 'react-bootstrap';

function SearchBar({ setCatches, setCurrentPage })
{
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [manualTrigger, setManualTrigger] = useState(0);
        
        const {
          data: searchResults,
          isLoading,
          isError,
          error,
        } = useQuery({
          queryKey: ['search', searchTerm, searchField, manualTrigger],
          queryFn: () => searchCatches({ search: searchTerm, field: searchField }),
          enabled: !!searchTerm, // don’t auto-fetch until there's a keyword
          staleTime: 1000 * 60 * 5,
          cacheTime: 1000 * 60 * 10,
        });
      
        const handleSearch = (e) => {
          e.preventDefault();
          setManualTrigger(prev => prev + 1); // triggers refetch
        };
      
        useEffect(() => {
          if (searchResults) {
            setCatches(searchResults);
            setCurrentPage(1);
          }
        }, [searchResults]);

    return(
        <Form className="d-flex mb-4" onSubmit={handleSearch}>
        <Form.Control
            data-testid="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
        />
        <Form.Select
            data-testid="search-filter"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="me-2"
        >
            <option value="">All fields</option>
            <option value="species">Species</option>
            <option value="area">Location</option>
            <option value="body_of_water">Body of Water</option>
        </Form.Select>
        {isLoading && <p>Loading...</p>}
            {isError && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </Form>
    )
}

export default SearchBar;