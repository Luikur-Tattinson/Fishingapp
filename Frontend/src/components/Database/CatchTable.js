import React from 'react';
import { Table } from 'react-bootstrap';
import { weatherEmojis, weatherDescriptions } from './WeatherUtils';

function CatchTable({ currentCatches, handleRowClick, handleSort }) {
  return (
    <>
    {currentCatches.length === 0 ? (
      <p>No catches found</p>
    ) : (
    <Table striped bordered hover className="table-responsive">
      <thead>
        <tr>
          <th onClick={() => handleSort('species')} style={{ cursor: 'pointer' }}>Species</th>
          <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>Weight (kg)</th>
          <th onClick={() => handleSort('length')} style={{ cursor: 'pointer' }}>Length (cm)</th>
          <th onClick={() => handleSort('date_caught')} style={{ cursor: 'pointer' }}>Date</th>
          <th onClick={() => handleSort('area')} style={{ cursor: 'pointer' }}>Location</th>
          <th onClick={() => handleSort('body_of_water')} style={{ cursor: 'pointer' }}>Body of water</th>
          <th>Weather</th>
        </tr>
      </thead>
      <tbody>
        {currentCatches.map((entry) => (
          <tr key={entry.id} onClick={() => handleRowClick(entry)} style={{ cursor: 'pointer' }}>
            <td>{entry.species}</td>
            <td>{entry.weight}</td>
            <td>{entry.length}</td>
            <td>{entry.date_caught}</td>
            <td>{entry.area}</td>
            <td>{entry.body_of_water}</td>
            <td>{weatherEmojis[entry.weather_code] || 'Not available'} {weatherDescriptions[entry.weather_code]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    )}
    </>
  );
}

export default CatchTable;
