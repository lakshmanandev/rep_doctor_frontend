import React, { useState, useRef } from "react";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useAuth from "../../hooks/useAuth";
import { toastAlert } from "../../utils/toast";

const TwoFactorAuth = ({ onVerify }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { verifyTwoFactor } = useAuth();


  // Handle input change
  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input if value is entered
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle key press for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, ""); // get only digits

    if (paste) {
      const pasteArray = paste.split("").slice(0, inputRefs.current.length);
      const newCode = [...code];

      pasteArray.forEach((char, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = char; // Optional visual update
          newCode[i] = char;
        }
      });

      setCode(newCode); // ✅ Update state

      // Optionally move focus to the last pasted input
      const lastIndex = pasteArray.length - 1;
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeString = code.join("");

    if (codeString.length === 6) {
      const repsonse = await verifyTwoFactor({ token: codeString });
      if (repsonse.validated) {
        onVerify();
      }else{
        toastAlert("error","Invalid 2FA Code")
      }
    }
  };

  return (
    <>
      <div
        className="forgot-password-page min-vh-100 d-flex align-items-center">
        <Container className="position-relative z-1">
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={6}>
              <Card className="forgot-password-card border-0 shadow-lg rounded-5 p-4">
                <Card.Body className="card-body-container p-4 pt-0">
                  <h3 className="page-title fw-bold mb-1 mt-3">
                    Two-Factor Authentication
                  </h3>
                  <p className="page-description text-muted mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <Form
                    onSubmit={handleSubmit}
                    className="forgot-password-form"
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>Verification Code</Form.Label>
                      <div className="verification-code-container">
                        {code.map((digit, index) => (
                          <Form.Control
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className={`verification-code-input ${digit ? "valid" : ""
                              }`}
                            value={digit}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                            onPaste={handlePaste}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        ))}
                      </div>
                    </Form.Group>

                    <Button
                      variant="dark"
                      type="submit"
                      className="submit-button w-100 py-3 mb-3"
                      disabled={code.some((digit) => digit === "")}
                    >
                      Verify
                    </Button>
                  </Form>

                </Card.Body>
                <Card.Footer className="card-footer bg-white text-center border-0 pt-4 pb-0 mb-1">
                  <small className="text-muted">
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
    </>
  );
};

export default TwoFactorAuth;