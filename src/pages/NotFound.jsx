import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NotFound.css';
import bgimg from "../assets/images/vendorLoginBg.jpg";

const NotFound = () => {
  return (
    <div className="page-container">
      <img
        src={bgimg}
        alt="City background"
        className="background-image"
      />


      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="not-found-card">
          <div className="header-container text-center mt-0 pt-0 mb-4">
            <h2 className="app-title fw-bold mt-0 text-center w-100">AKC</h2>
          </div>
          
          <div className="text-center mb-4">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-message">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="action-buttons">
            <Link to="/">
              <Button variant="dark" className="main-action-btn">
                Back to Home
              </Button>
            </Link>
            {/* <Link to="/contact-support" className="support-link">
              Contact Support
            </Link> */}
          </div>
          <Card.Footer className="card-footer bg-white text-center border-0 pt-4 pb-1">
            <small className="footer-text text-muted">
              © 2025 AKC /{" "}
              <a
                href="#privacy-terms"
                className="footer-link text-decoration-none fw-bold text-body"
              >
                Privacy & Terms of Use
              </a>
            </small>
          </Card.Footer>
        </div>

      </Container>


    </div>
  );
};

export default NotFound;