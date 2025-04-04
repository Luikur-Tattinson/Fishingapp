import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import MapSelector from './MapSelector';
import axiosInstance from '../../utils/axiosInstance';

function AddEntryModal({ fetchCatches, coords, setCoords, handleUseMyLocation }) 
{
    const [show, setShow] = useState(false);
    const [area, setArea] = useState('');
    const [BoW, setBoW] = useState('');
    const [species, setSpecies] = useState('');
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [date_caught, setCatchDate] = useState('');
    const [time_caught, setTimeCaught] = useState('');
    const [image, setImage] = useState(null);

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
      return (
        <div>
        <button className="btn btn-primary" onClick={handleShow}>Add a new entry</button>
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
            <p data-testid="coords-display">
              Selected: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
          </>

          <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
        </div>     
      );
}

export default AddEntryModal;