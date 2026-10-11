import React, { useState } from 'react';

const costMap = {
  'Washing Machine': { base: 399, motor: 300, belt: 150, drum: 500 },
  'Refrigerator': { base: 499, compressor: 1200, gas: 800, thermostat: 400 },
  'AC': { base: 599, gas: 1000, compressor: 1500, fan: 300 },
  'Fan': { base: 249, motor: 200, capacitor: 100, regulator: 150 },
  'Iron': { base: 199, cord: 80, thermostat: 100, plate: 150 },
};

function CostCalculator() {
  const [appliance, setAppliance] = useState('');
  const [issues, setIssues] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const calculateCost = () => {
    if (!appliance || !costMap[appliance]) return;
    let total = costMap[appliance].base;
    issues.forEach(issue => {
      if (costMap[appliance][issue]) total += costMap[appliance][issue];
    });
    setEstimatedCost(total);
  };

  return (
    <div className="container">
      <h2 className="section-title">💰 Repair Cost Estimator</h2>
      <div className="card">
        <div className="form-group">
          <label>Select Appliance</label>
          <select value={appliance} onChange={(e) => setAppliance(e.target.value)}>
            <option value="">Select</option>
            <option>Washing Machine</option>
            <option>Refrigerator</option>
            <option>AC</option>
            <option>Fan</option>
            <option>Iron</option>
          </select>
        </div>
        {appliance && costMap[appliance] && (
          <div className="form-group">
            <label>Select Issues (multiple)</label>
            <div>
              {Object.keys(costMap[appliance]).filter(k => k !== 'base').map(issue => (
                <label key={issue} style={{ display: 'block', margin: '5px 0' }}>
                  <input type="checkbox" value={issue} onChange={(e) => {
                    if (e.target.checked) setIssues([...issues, issue]);
                    else setIssues(issues.filter(i => i !== issue));
                  }} />
                  {issue.toUpperCase()} - ₹{costMap[appliance][issue]}
                </label>
              ))}
            </div>
          </div>
        )}
        <button className="submit-btn" onClick={calculateCost}>Calculate Estimate</button>
        {estimatedCost > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '5px' }}>
            <h3>💰 Estimated Cost: ₹{estimatedCost}</h3>
            <p>*Final price may vary after physical inspection</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CostCalculator;