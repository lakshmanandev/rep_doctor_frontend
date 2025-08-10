import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bgimg from "../../assets/images/cryptocurrency-concept-with-bitcoin_23-2149153402.avif";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Login.css";
import { toastAlert } from "../../utils/toast";
import { setCookies } from "../../utils/cookies";
import Cookies from "js-cookie";
import { decryptObject } from "../../utils/crypto";
import { AuthContext } from "../../context/AuthContext";
import log from "../../utils/logger";

//Form Value
const intialFormValue = {
  email: "",
  password: "",
  rememberMe: false,
};

const Login = () => {
  const back_image = bgimg;
  const [formValue, setFormValue] = useState(intialFormValue);
  const { email, password, rememberMe } = formValue;
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { admin_login } = useAuth();
  const { setIsAuthenticated, initAuth } = useContext(AuthContext);


  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const remember_me = Cookies.get("remember_me_admin");
    if (remember_me) {
      const decrypt = decryptObject(remember_me);
      setFormValue((prev) => ({
        ...prev,
        email: decrypt.email,
        password: decrypt.password,
      }));
    }
  }, []);


  //form Handler
  const changesHandler = (e) => {
    const { id, value, checked, type } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await admin_login({ email, password });

      if (response) {
        await setCookies(response.token, rememberMe, formValue);
        toastAlert("success", response.message || "Login Successfully");

        setIsAuthenticated(true);
        await initAuth();
        navigate("/"); // Admin Dashboard
      } else {
        toastAlert("warning", response.message || "Unexpected login response.");
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      setLoginError(errMessage);
      toastAlert("error", errMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="login-page min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${back_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="position-relative z-1">
        <Row className="justify-content-center">
          <Col md={7} lg={7} xl={6}>
            <Card className="login-card border-0 shadow-lg rounded-3 p-4">
              <Card.Body className="card-body-container p-4 pt-0">
                <div className="header-container text-center mt-0 pt-0 mb-4">
                  <h2 className="app-title fw-bold mt-0 text-center w-100">Login</h2>
                </div>

                <h3 className="page-title fw-bold mb-1">Welcome Back</h3>
                <p className="page-description text-muted mb-4">
                  Sign in to your admin account
                </p>

                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    {loginError}
                  </div>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit} className="login-form">
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <div className="position-relative ">
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        required
                        onChange={changesHandler}
                        className="email-input p-3 pe-5 ps-2 "
                      />
                      <Form.Control.Feedback type="invalid">
                        <i className="bi bi-exclamation-circle text-danger me-1" />
                        Please provide a valid email address.
                      </Form.Control.Feedback>

                      <button
                        type="button"
                        tabIndex={-1}
                        className="position-absolute bg-transparent border-0 p-0"
                        style={{
                          right: "16px",
                          top: "16px",
                          zIndex: 2,
                          cursor: "default",
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

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={changesHandler}
                        required
                        className="password-input p-3 pe-5 ps-2"
                        minLength="6"
                      />
                      <Form.Control.Feedback type="invalid">
                        <i className="bi bi-exclamation-circle text-danger me-1" />
                        Please enter your password.
                      </Form.Control.Feedback>

                      <button
                        type="button"
                        tabIndex={-1}
                        className="position-absolute bg-transparent border-0 p-0"
                        style={{
                          right: "16px",
                          top: "16px",
                          zIndex: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="23"
                            fill="none"
                            viewBox="0 0 20 23"
                          >
                            <path
                              d="M16.8998 7.7127H14.6123V4.9377C14.6123 2.3877 12.5498 0.325195 9.99981 0.325195C7.4498 0.325195 5.4248 2.3877 5.4248 4.9377V6.0502H7.1123V4.9377C7.1123 3.3252 8.4248 2.0127 10.0373 2.0127C11.6498 2.0127 12.9623 3.3252 12.9623 4.9377V7.7127H3.1373C1.7123 7.7127 0.549805 8.8377 0.549805 10.1877V15.6252C0.549805 19.4877 3.8873 22.6377 7.9748 22.6377H12.0998C16.1873 22.6377 19.4873 19.4502 19.4873 15.5127V10.1877C19.4873 8.8377 18.3248 7.7127 16.8998 7.7127ZM17.7998 15.5127C17.7998 18.5127 15.2498 20.9502 12.0998 20.9502H7.9748C4.8248 20.9502 2.2373 18.5502 2.2373 15.6252V10.1877C2.2373 9.73769 2.6498 9.4002 3.1373 9.4002H16.8998C17.3873 9.4002 17.7998 9.73769 17.7998 10.1877V15.5127Z"
                              fill="#0A0A0A"
                              fillOpacity="0.6"
                            />
                            <path
                              d="M11.5371 14.2754H8.46211C7.78711 14.2754 7.22461 14.8379 7.22461 15.5129V18.5879C7.22461 19.2629 7.78711 19.8254 8.46211 19.8254H11.5371C12.2121 19.8254 12.7746 19.2629 12.7746 18.5879V15.5129C12.7746 14.8379 12.2121 14.2754 11.5371 14.2754ZM11.0871 18.1004H8.94961V15.9629H11.0871V18.1004Z"
                              fill="#0A0A0A"
                              fillOpacity="0.6"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="23"
                            fill="none"
                            viewBox="0 0 20 23"
                          >
                            <path
                              d="M16.8998 7.7127H14.6123V4.9377C14.6123 2.3877 12.5498 0.325195 9.99981 0.325195C7.4498 0.325195 5.4248 2.3877 5.4248 4.9377V7.7127H3.1373C1.7123 7.7127 0.549805 8.8377 0.549805 10.1877V15.6252C0.549805 19.4877 3.8873 22.6377 7.9748 22.6377H12.0998C16.1873 22.6377 19.4873 19.4502 19.4873 15.5127V10.1877C19.4873 8.8377 18.3248 7.7127 16.8998 7.7127ZM7.1123 4.9377C7.1123 3.3252 8.4248 2.0127 10.0373 2.0127C11.6498 2.0127 12.9623 3.3252 12.9623 4.9377V7.7127H7.1123V4.9377ZM17.7998 15.5127C17.7998 18.5127 15.2498 20.9502 12.0998 20.9502H7.9748C4.8248 20.9502 2.2373 18.5502 2.2373 15.6252V10.1877C2.2373 9.73769 2.6498 9.4002 3.1373 9.4002H16.8998C17.3873 9.4002 17.7998 9.73769 17.7998 10.1877V15.5127Z"
                              fill="#0A0A0A"
                              fillOpacity="0.6"
                            />
                            <path
                              d="M11.5371 14.2754H8.46211C7.78711 14.2754 7.22461 14.8379 7.22461 15.5129V18.5879C7.22461 19.2629 7.78711 19.8254 8.46211 19.8254H11.5371C12.2121 19.8254 12.7746 19.2629 12.7746 18.5879V15.5129C12.7746 14.8379 12.2121 14.2754 11.5371 14.2754ZM11.0871 18.1004H8.94961V15.9629H11.0871V18.1004Z"
                              fill="#0A0A0A"
                              fillOpacity="0.6"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember Me"
                      checked={rememberMe}
                      onChange={changesHandler}
                    />
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none fw-bold text-body"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    variant="dark"
                    type="submit"
                    className="submit-button w-100 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>


                <div className="support-container text-center text-muted mt-4">
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

export default Login;