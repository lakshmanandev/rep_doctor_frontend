// src/components/forms/FloatingInput.js
import React from 'react';
import { Col } from 'react-bootstrap';

const FloatingInput = ({ id, label, value = '', onChange, type = "text", required = false, size = 6, placeholder = '', error = '', ...rest }) => (
  <Col md={size} sm={12}>
    <div className="form-group">
      <input
        id={id}
        className="form-controll"
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        {...rest}
      />
      <label className="labell" htmlFor={id}>
        {label}
        {required && <span className="gl-form-asterisk"></span>}
      </label>
      {error && <div className="invalid-feedback d-block text-start">{error}</div>}
    </div>
  </Col>
);

export default FloatingInput;

