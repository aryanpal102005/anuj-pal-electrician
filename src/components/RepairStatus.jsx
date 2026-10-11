import React, { useState } from 'react';

function RepairStatus({ repairRequests }) {
  const [searchId, setSearchId] = useState('');
  const [foundRequest, setFoundRequest] = useState(null);

  const searchRequest = () => {
    const request = repairRequests.find(
      (r) => r.id === Number(searchId)
    );
    setFoundRequest(request || null);
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'picked', 'repairing', 'completed'];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="status-tracker">
        {steps.map((step, index) => (
          <div className="status-step" key={step}>
            <div
              className={`status-circle ${
                index <= currentIndex ? 'completed' : ''
              }`}
            >
              {index <= currentIndex ? '✓' : index + 1}
            </div>
            <div>{step.toUpperCase()}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="section-title">📊 Repair Status Tracker</h2>

      <div className="card">
        <div className="form-group">
          <label>Enter Your Request ID</label>

          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID"
          />

          <button
            className="submit-btn"
            onClick={searchRequest}
            style={{ marginTop: '10px' }}
          >
            Track Status
          </button>
        </div>

        {foundRequest && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Request ID: {foundRequest.id}</h3>
            <p>Customer: {foundRequest.name}</p>
            <p>Appliance: {foundRequest.appliance}</p>

            {getStatusStep(foundRequest.status)}

            <p>📅 Request Date: {foundRequest.date}</p>
          </div>
        )}

        {!foundRequest && searchId && (
          <p>No request found with this ID</p>
        )}
      </div>
    </div>
  );
}

export default RepairStatus;