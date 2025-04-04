import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SearchBar from './Searchbar';
import CatchTable from './CatchTable';
import PaginationControls from './PaginationControls';
import AddEntryModal from './AddEntryModal';
import CatchDetailsModal from './CatchDetailsModal';

function Database()
{
    const [catches, setCatches] = useState([]);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const fetchCatches = async () => {
      try
      {
          const response = await axiosInstance.get('http://localhost:8000/api/get-catches/');
          setCatches(response.data); 
      } catch (error)
      {
          console.error(error);
      }
  };

    useEffect(() => {
        fetchCatches();       
    }, []);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const sortedCatches = [...catches].sort((a, b) => {
      const { key, direction } = sortConfig;
    
      if (!key) return 0;
    
      const isAsc = direction === 'asc';
    
      const valA = a[key];
      const valB = b[key];
    
      // Handle date
      if (key === 'date_caught') {
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        return isAsc ? dateB - dateA : dateA - dateB;
      }
    
      // Handle number
      if (typeof valA === 'number' || !isNaN(parseFloat(valA))) {
        return isAsc ? valA - valB : valB - valA;
      }
    
      // Handle string (case-insensitive)
      return isAsc
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });
    
    const totalEntries = catches.length;
    const indefOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indefOfLast - entriesPerPage;
    const currentCatches = sortedCatches.slice(indexOfFirst, indefOfLast);
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const handleSort = (key) => {
      setSortConfig((prev) => {
        if (prev.key === key) {
          return {
            key,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
          };
        } else {
          return {
            key,
            direction: 'asc',
          };
        }
      });
    };
    
    //Catch details
    const [selectedCatch, setSelectedCatch] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleRowClick = (catchEntry) => {
      setSelectedCatch(catchEntry);
      setShowDetailModal(true);
    };

    const handleDetailClose = () => {
      setSelectedCatch(null);
      setShowDetailModal(false);
    };

    //Map
    const [coords, setCoords] = useState(null);

    const handleUseMyLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
    
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve your location.");
        }
      );
    };

    return(
      <Container className="mt-4">
      <h2>Fishing Database</h2>
      {!isLoggedIn ? (
        <>
        </>
      ) : (
      <AddEntryModal fetchCatches={fetchCatches} coords={coords} setCoords={setCoords} handleUseMyLocation={handleUseMyLocation} />     
      )} 
      <CatchDetailsModal selectedCatch={selectedCatch} handleDetailClose={handleDetailClose} showDetailModal={showDetailModal} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} entriesPerPage={entriesPerPage} 
        setEntriesPerPage={setEntriesPerPage} setCurrentPage={setCurrentPage} />
      <SearchBar setCatches={setCatches} setCurrentPage={setCurrentPage} />
      <CatchTable currentCatches={currentCatches} handleRowClick={handleRowClick} handleSort={handleSort} />
    </Container>
  );
}

export default Database;