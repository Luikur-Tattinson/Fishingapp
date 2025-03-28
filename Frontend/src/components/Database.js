import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';

function Database()
{
    const [catches, setCatches] = useState([]);

    useEffect(() => {
        const fetchCatches = async () => {
            try
            {
                const response = await axios.get('http://localhost:8000/api/get-catches/');
                setCatches(response.data);     
            } catch (error)
            {
                console.error(error);
            }
        };
        fetchCatches();
    }, []);

    return(
        <Container className="mt-4">
      <h2>Fishing Database</h2>
      {catches.length === 0 ? (
        <p>No catches recorded yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Species</th>
              <th>Weight (kg)</th>
              <th>Length (cm)</th>
              <th>Date</th>
              <th>Location</th>
              <th>Body of Water</th>
            </tr>
          </thead>
          <tbody>
            {catches.map((c, index) => (
              <tr key={index}>
                <td>{c.species}</td>
                <td>{c.weight}</td>
                <td>{c.length}</td>
                <td>{c.date_caught}</td>
                <td>{c.area}</td>
                <td>{c.body_of_water}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Database;