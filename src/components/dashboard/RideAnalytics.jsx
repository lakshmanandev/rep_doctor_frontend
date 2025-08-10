// RideAnalytics.jsx - Component for ride analytics with Bootstrap
import React, { useState } from 'react';
import { Card, Form, ProgressBar } from 'react-bootstrap';

const RideAnalytics = ({ data }) => {
  const [timeframe, setTimeframe] = useState('Last 7 Days');

  return (
    <Card className="h-100 shadow-sm rounded-4 border">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title">Ride Analytics</h5>
          <Form.Select
            className='border-none'
            size="sm"
            style={{ width: 'auto', border: 'none', boxShadow: 'none' }}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </Form.Select>
        </div>

        <div className="mt-4">
          {data.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <p className="mb-0">{item.type}</p>
                <p className="mb-0 fw-medium">{item.value.toLocaleString()}</p>
              </div>
              <ProgressBar
                className={`mt-1 ${item.type.includes('Cancellation') ? 'progress-cancel' : 'progress-normal'}`}
                now={item.percentage}
              />

            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RideAnalytics;