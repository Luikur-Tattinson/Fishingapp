import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Table, Container, Form, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import MapSelector from './MapSelector';
import CatchMap from './CatchMap';

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

    //Modal
    const [show, setShow] = useState(false);
    const [area, setArea] = useState('');
    const [BoW, setBoW] = useState('');
    const [species, setSpecies] = useState('');
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [date_caught, setCatchDate] = useState('');
    const [image, setImage] = useState(null);
    const [time_caught, setTimeCaught] = useState('');

    const handleClose = () => {
      setShow(false);
      setArea('');
      setBoW('');
      setSpecies('');
      setWeight('');
      setLength('');
      setCatchDate('');
      setTimeCaught('');
      setImage(null);
      setCoords(null);
    }

    const handleShow = () => setShow(true);

    const AddEntrySubmit = async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('accessToken');

      const formData = new FormData();
        formData.append('area', area);
        formData.append('body_of_water', BoW);
        formData.append('species', species);
        formData.append('weight', weight);
        formData.append('length', length);
        formData.append('date_caught', date_caught);
        formData.append('time_caught', time_caught);
        formData.append('latitude', coords.latitude);
        formData.append('longitude', coords.longitude);

      if (image)
      {
        formData.append('image', image);
      }

      try
      {
        const response = await axiosInstance.post('http://localhost:8000/api/catches/add/', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Catch added:', response.data);
        alert('Catch added');
        handleClose();
        fetchCatches();
      } catch (error)
      {
        console.error(error);
        alert(
          error.response?.data?.error ||
          'An error occured'
        );
      }
    };


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

    //Weather stuff
    const weatherEmojis = {
      0: "☀️",  // Clear sky
      1: "🌤️",  // Mostly clear
      2: "⛅",   // Partly cloudy
      3: "☁️",  // Overcast
      45: "🌫️", // Fog
      48: "🌫️", // Rime fog
      51: "🌦️", // Light drizzle
      53: "🌧️", // Moderate drizzle
      55: "🌧️", // Dense drizzle
      61: "🌦️", // Light rain
      63: "🌧️", // Moderate rain
      65: "🌧️", // Heavy rain
      71: "🌨️", // Light snow
      73: "🌨️", // Moderate snow
      75: "❄️",  // Heavy snow
      80: "🌦️", // Rain showers
      95: "⛈️",  // Thunderstorm
      96: "⛈️",  // Thunderstorm with hail
    };
    
    const weatherDescriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm + hail",
    };
    

    return(
      <Container className="mt-4">
      <h2>Fishing Database</h2>
      {!isLoggedIn ? (
        <>
        </>
      ) : (
        <button className="btn btn-primary" onClick={handleShow}>Add a new entry</button>      
      )} 
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new catch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={AddEntrySubmit}>
          <Form.Group className="mb-3" controlId="formArea">
            <Form.Label>Area</Form.Label>
              <Form.Control
                type="text"
                name="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBoW">
            <Form.Label>Body of water</Form.Label>
              <Form.Control
                type="text"
                name="BoW"
                value={BoW}
                onChange={(e) => setBoW(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSpecies">
            <Form.Label>Species</Form.Label>
              <Form.Control
                type="text"
                name="Species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWeight">
            <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                name="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />              
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLength">
            <Form.Label>Length</Form.Label>
              <Form.Control
                type="text"
                name="Length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Catch date</Form.Label>
              <Form.Control
                type="date"
                name="Date"
                value={date_caught}
                onChange={(e) => setCatchDate(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTime">
            <Form.Label>Catch Time</Form.Label>
              <Form.Control
                type="time"
                name="time_caught"
                value={time_caught}
                onChange={(e) => setTimeCaught(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
          </Form.Group>

          <Button variant="secondary" className="mb-3" onClick={handleUseMyLocation}>Use My Location</Button>

          <>
          <MapSelector coords={coords} setCoords={setCoords} />
          
          {coords && (
            <p>
              Selected: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
          </>

          <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDetailModal} onHide={handleDetailClose}>
  <Modal.Header closeButton>
    <Modal.Title>Catch Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedCatch ? (
      <>
        <p><strong>Species:</strong> {selectedCatch.species}</p>
        <p><strong>Weight:</strong> {selectedCatch.weight} kg</p>
        <p><strong>Length:</strong> {selectedCatch.length} cm</p>
        <p><strong>Date Caught:</strong> {selectedCatch.date_caught}</p>
        <p><strong>Time Caught:</strong> {selectedCatch.time_caught}</p>
        <p><strong>Area:</strong> {selectedCatch.area}</p>
        <p><strong>Body of Water:</strong> {selectedCatch.body_of_water}</p>
        <p><strong>Added by:</strong> {selectedCatch.user || 'Unknown'}</p>
        <p><strong>Temperature:</strong> {selectedCatch.temperature}</p>
        <p><strong>Windspeed:</strong> {selectedCatch.windspeed}</p>
        <p><strong>Precipitation:</strong> {selectedCatch.precipitation}</p>
        <p><strong>Weather:</strong> {weatherEmojis[selectedCatch.weather_code]} {weatherDescriptions[selectedCatch.weather_code]}</p>
        {selectedCatch.image && (
          <img
            src={`http://localhost:8000${selectedCatch.image}`}
            alt="Catch"
            className="img-fluid mt-3"
          />
        )}
        {selectedCatch.latitude && selectedCatch.longitude && (
          <CatchMap latitude={selectedCatch.latitude} longitude={selectedCatch.longitude} />
        )}
      </>
    ) : (
      <p>Loading...</p>
    )}
  </Modal.Body>
</Modal>


  <div className="d-flex justify-content-between align-items-center mb-3">
  <Form.Select
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

      {catches.length === 0 ? (
        <p>No catches recorded yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('species')} style={{ cursor: 'pointer'}}>
                Species {sortConfig.key == 'species' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer'}}>
                Weight (kg) {sortConfig.key == 'weight' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('length')} style={{ cursor: 'pointer'}}>
                Length (cm) {sortConfig.key == 'length' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('date_caught')} style={{ cursor: 'pointer'}}>
                Date {sortConfig.key == 'date_caught' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('area')} style={{ cursor: 'pointer'}}>
                Location {sortConfig.key == 'area' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('body_of_water')} style={{ cursor: 'pointer'}}>
                Body of water {sortConfig.key == 'body_of_water' && (sortConfig.direction == 'asc' ? '▲' : '▼')}</th>
                <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            {currentCatches.map((c, index) => (
              <tr key={index} onClick={() => handleRowClick(c)} style={{ cursor: 'pointer'}}>
                <td>{c.species}</td>
                <td>{c.weight}</td>
                <td>{c.length}</td>
                <td>{c.date_caught}</td>
                <td>{c.area}</td>
                <td>{c.body_of_water}</td>
                <td>{weatherEmojis[c.weather_code] || 'Not available'} {weatherDescriptions[c.weather_code]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Database;