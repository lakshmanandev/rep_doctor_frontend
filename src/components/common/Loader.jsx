import React from 'react';
import './LoadingScreen.css'

const CustomTransactionLoader = ({text="Loading transactions..."}) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <div className="spinner" />
    <p className="text-muted mt-2">{text}</p>
  </div>
);


export default CustomTransactionLoader;