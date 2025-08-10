import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import bgimg from "../../assets/images/bg_img.png";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toastAlert } from "../../utils/toast";
import log from "../../utils/logger";

// Icons
const EyeShowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="24"
    viewBox="0 0 20 24"
    fill="none"
    style={{ display: "block" }} // ✨ Important fix
  >
    <path
      d="M16.8998 8.2127H14.6123V5.4377C14.6123 2.8877 12.5498 0.825195 9.99981 0.825195C7.4498 0.825195 5.4248 2.8877 5.4248 5.4377V8.2127H3.1373C1.7123 8.2127 0.549805 9.3377 0.549805 10.6877V16.1252C0.549805 19.9877 3.8873 23.1377 7.9748 23.1377H12.0998C16.1873 23.1377 19.4873 19.9502 19.4873 16.0127V10.6877C19.4873 9.3377 18.3248 8.2127 16.8998 8.2127ZM7.1123 5.4377C7.1123 3.8252 8.4248 2.5127 10.0373 2.5127C11.6498 2.5127 12.9623 3.8252 12.9623 5.4377V8.2127H7.1123V5.4377ZM17.7998 16.0127C17.7998 19.0127 15.2498 21.4502 12.0998 21.4502H7.9748C4.8248 21.4502 2.2373 19.0502 2.2373 16.1252V10.6877C2.2373 10.2377 2.6498 9.9002 3.1373 9.9002H16.8998C17.3873 9.9002 17.7998 10.2377 17.7998 10.6877V16.0127Z"
      fill="#0A0A0A"
      fill-opacity="0.6"
    />
    <path
      d="M11.5371 14.7754H8.46211C7.78711 14.7754 7.22461 15.3379 7.22461 16.0129V19.0879C7.22461 19.7629 7.78711 20.3254 8.46211 20.3254H11.5371C12.2121 20.3254 12.7746 19.7629 12.7746 19.0879V16.0129C12.7746 15.3379 12.2121 14.7754 11.5371 14.7754ZM11.0871 18.6004H8.94961V16.4629H11.0871V18.6004Z"
      fill="#0A0A0A"
      fill-opacity="0.6"
    />
  </svg>
);

const EyeHideIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="24"
    viewBox="0 0 20 24"
    fill="none"
    style={{ display: "block" }} // ✨ Important fix
  >
    <path
      d="M16.9002 8.2127H14.6127V5.4377C14.6127 2.8877 12.5502 0.825195 10.0002 0.825195C7.45019 0.825195 5.4252 2.8877 5.4252 5.4377C5.4252 5.8877 5.8002 6.3002 6.2877 6.3002C6.7752 6.3002 7.1502 5.9252 7.1502 5.4377C7.1502 3.8252 8.4627 2.5127 10.0752 2.5127C11.6877 2.5127 13.0002 3.8252 13.0002 5.4377V8.2127H3.1002C1.6752 8.2127 0.512695 9.3377 0.512695 10.6877V16.1252C0.512695 19.9877 3.8502 23.1377 7.9377 23.1377H12.0627C16.1502 23.1377 19.4502 19.9502 19.4502 16.0127V10.6877C19.4877 9.3377 18.3252 8.2127 16.9002 8.2127ZM17.8002 16.0127C17.8002 19.0127 15.2502 21.4502 12.1002 21.4502H7.9752C4.8252 21.4502 2.2377 19.0502 2.2377 16.1252V10.6877C2.2377 10.2377 2.6502 9.9002 3.1377 9.9002H16.9002C17.3877 9.9002 17.8002 10.2377 17.8002 10.6877V16.0127Z"
      fill="#0A0A0A"
      fill-opacity="0.6"
    />
    <path
      d="M11.5376 14.7754H8.4626C7.7876 14.7754 7.2251 15.3379 7.2251 16.0129V19.0879C7.2251 19.7629 7.7876 20.3254 8.4626 20.3254H11.5376C12.2126 20.3254 12.7751 19.7629 12.7751 19.0879V16.0129C12.7751 15.3379 12.2126 14.7754 11.5376 14.7754ZM11.0876 18.6004H8.9501V16.4629H11.0876V18.6004Z"
      fill="#0A0A0A"
      fill-opacity="0.6"
    />
  </svg>
);

const Reset_Password = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmpassword: false,
  });

  log(id, "value");

  const [errors, setErrors] = useState({
    password: "",
    confirmpassword: "",
  });

  const { resetPassword } = useAuth();

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { password: "", confirmpassword: "" };

    // Regex: min 8 chars, 1 upper, 1 lower, 1 number, 1 special
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
      isValid = false;
    }

    if (!confirmpassword) {
      newErrors.confirmpassword = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      return;
    }
    setErrors({});

    log(password);

    try {
      const response = await resetPassword({ id, password });
      log(response, "response");

      if (response?.status) {
        toastAlert(
          "success",
          response.message || "Password reseted successfully."
        );
        // setShowSuccess(true);
        navigate("/");
      } else {
        toastAlert("warning", response.message || "Password reset failed.");
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toastAlert("error", errMessage);
    } finally {
      return;
    }
  };

  return (
    <div
      className="forgot-password-page min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="position-relative z-1">
        <Row className="justify-content-center">
          <Col md={7} lg={7} xl={6}>
            <Card className="forgot-password-card border-0 shadow-lg rounded-3 p-4">
              <Card.Body className="card-body-container p-4 pt-0">
                <div className="header-container text-center mt-0 pt-0 mb-5">
                  <h2 className="app-title fw-bold mt-0 pb-2">AKC</h2>
                </div>

                <h3 className="page-title fw-bold mb-1">Reset Password</h3>
                <p className="page-description text-muted mb-4">
                  Enter a new password to reset your account
                </p>

                <Form
                  onSubmit={handleSubmit}
                  className="forgot-password-form mt-3 pt-3"
                >
                  {[
                    {
                      label: "New Password",
                      field: "password",
                      value: password,
                      setValue: setPassword,
                    },
                    {
                      label: "Confirm Password",
                      field: "confirmpassword",
                      value: confirmpassword,
                      setValue: setConfirmpassword,
                    },
                  ].map(({ label, field, value, setValue }) => (
                    <Form.Group className="mb-4" key={field}>
                      <Form.Label>{label}</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPasswords[field] ? "text" : "password"}
                          placeholder={label}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className={`p-3 pe-0 ps-2 ${errors[field] ? "border-danger" : ""
                            }`}
                        />
                        <div
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                          onClick={() => togglePassword(field)}
                        >
                          {showPasswords[field] ? (
                            <EyeHideIcon />
                          ) : (
                            <EyeShowIcon />
                          )}
                        </div>
                      </div>
                      {errors[field] && (
                        <div className="text-danger mt-1">
                          <i className="bi bi-exclamation-circle me-2" />
                          {errors[field]}
                        </div>
                      )}
                    </Form.Group>
                  ))}

                  <Button
                    variant="dark"
                    type="submit"
                    className="submit-button w-100 py-2 mt-5 mb-3"
                  >
                    Set password
                  </Button>
                </Form>

                <div className="support-container text-center text-muted">
                  <p className="mb-0 p-3">
                    Already have an account?{" "}
                    <a
                      href="#login"
                      className="text-decoration-none fw-bold text-body"
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </Card.Body>
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
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reset_Password;
