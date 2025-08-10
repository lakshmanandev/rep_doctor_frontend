// src/components/forms/SwitchToggle.js
import React from 'react';
import { Col, Form } from 'react-bootstrap';

const SwitchToggle = ({ id, label, checked, onChange, size = 6 }) => (
  <Col md={size} sm={12}>
    <div className="d-flex align-items-center justify-content-center mt-3">
      <Form.Check
        type="switch"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="fw-bold mb-0 ms-2">{label}</label>
    </div>
  </Col>
);

export default SwitchToggle;
