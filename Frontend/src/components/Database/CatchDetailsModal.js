import React from "react";
import { Modal } from "react-bootstrap";
import { weatherEmojis, weatherDescriptions } from './WeatherUtils';
import CatchMap from './CatchMap';

function CatchDetailsModal({ selectedCatch, handleDetailClose, showDetailModal })
{
    if (!selectedCatch) return null;

    const {
        species,
        weight,
        length,
        date_caught,
        area,
        body_of_water,
        temperature,
        windspeed,
        precipitation,
        weather_code,
      } = selectedCatch;

return(
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
)
}

export default CatchDetailsModal;
