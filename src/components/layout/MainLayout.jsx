// MainLayout.jsx - The main layout wrapper using Bootstrap
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ title,children }) => {
  return (
    <div className="d-flex h-100 dashboard">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Header title={title} />
        <main className="flex-grow-1 overflow-auto">
          <Container fluid>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;