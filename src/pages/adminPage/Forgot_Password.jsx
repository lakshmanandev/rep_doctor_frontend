import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { ArrowLeft, Envelope } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import bgimg from "../../assets/images/bg_img.png";
import { Link } from "react-router-dom";
import log from "../../utils/logger";
import useAuth from "../../hooks/useAuth";
import './Login.css';
import '../../App.css';
import { toastAlert } from "../../utils/toast";

const Forgot_Password = () => {
  const back_image = bgimg;
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const { forgotPassword } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) {
      return true;
    }
    return false;
  }

  const Fromvalidation = async () => {
    try {
      var validateError = {};

      if (email.trim() == "") {
        validateError.email = "Email is required";
      } else if (!ValidateEmail(email)) {
        validateError.email = "Invalid email address";
      }
      setError(validateError);
      return validateError;
    } catch (err) {
      log(err);
    }
  };


  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setIsLoading(true);
    setLoginError(null);

    try {
      const check = await Fromvalidation();
      var errorsSize = Object.keys(check).length;

      if (errorsSize == 0) {
        const response = await forgotPassword({ email }); // New API call

        if (response?.status) {
          setEmail("");
          toastAlert("success", result.message);
        } else {
          toastAlert("warning", response.message || "OTP verification failed");
        }
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "OTP verification failed. Try again.";
      setLoginError(errMessage);
      toastAlert("error", errMessage);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div
      className="forgot-password-page min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${back_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="position-relative z-1">
        <Row className="justify-content-center">
          <Col md={8} lg={8} xl={6}>
            <Card className="forgot-password-card border-0 shadow-lg rounded-3 p-4 pt-3">
              <Card.Body className="card-body-container p-4 pt-0">
                <div className="header-container text-center mt-0 pt-0 pb-4">
                  <h2 className="app-title fw-bold mt-0">REP DOC</h2>
                </div>

                <Button
                  variant="link"
                  className="back-button p-0 text-decoration-none pt-3 mb-4 d-flex align-items-center text-body"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="me-2" /> Back
                </Button>

                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    {loginError}
                  </div>
                )}

                <h3 className="page-title fw-bold pt-2">Forgot Password</h3>
                <p className="page-description text-muted">
                  Enter your email address to receive a password reset link.
                </p>

                <Form onSubmit={handleSubmit} noValidate validated={validated} className="forgot-password-form">
                  <Form.Group className="py-4 my-3">
                    <Form.Label>Email</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="email-input p-3 pe-0 ps-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        <i className="bi bi-exclamation-circle text-danger me-1" />
                        Please provide a valid email address.
                      </Form.Control.Feedback>
                        <button
                          type="button"
                          className="position-absolute bg-transparent border-0 p-0"
                          style={{
                            right: "16px",
                            top: "16px",
                            zIndex: 2,
                            cursor:  'default',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="25"
                            fill="none"
                          >
                            <path
                              d="M21.0002 4.09961H3.0002C1.7252 4.09961 0.637695 5.14961 0.637695 6.46211V18.6121C0.637695 19.8871 1.6877 20.9746 3.0002 20.9746H21.0002C22.2752 20.9746 23.3627 19.9246 23.3627 18.6121V6.42461C23.3627 5.14961 22.2752 4.09961 21.0002 4.09961ZM21.0002 5.78711C21.0377 5.78711 21.0752 5.78711 21.1127 5.78711L12.0002 11.6371L2.8877 5.78711C2.9252 5.78711 2.9627 5.78711 3.0002 5.78711H21.0002ZM21.0002 19.2121H3.0002C2.6252 19.2121 2.3252 18.9121 2.3252 18.5371V7.43711L11.1002 13.0621C11.3627 13.2496 11.6627 13.3246 11.9627 13.3246C12.2627 13.3246 12.5627 13.2496 12.8252 13.0621L21.6002 7.43711V18.5746C21.6752 18.9496 21.3752 19.2121 21.0002 19.2121Z"
                              fill="#0A0A0A"
                              fillOpacity="0.6"
                            />
                          </svg>
                        </button>
                    </div>
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="submit-button w-100 py-2 my-3 mt-2"
                    disabled={isLoading}
                  >
                    Send Password Reset Link
                  </Button>
                </Form>
                <div className="support-container text-center text-muted">
                  <p className="mb-0">
                    Having trouble?{" "}
                    <Link
                      to="/contact-support"
                      className="text-decoration-none fw-bold text-body"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </Card.Body>
              <Card.Footer className="card-footer bg-white text-center border-0 pt-4 pb-1">
                <small className="footer-text text-muted">
                  © 2025 REP_DOC /{" "}
                  <a
                    href="#privacy-terms"
                    className="footer-link text-decoration-none fw-bold text-body"
                  >
                    Privacy & Terms of Use
                  </a>
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Forgot_Password;