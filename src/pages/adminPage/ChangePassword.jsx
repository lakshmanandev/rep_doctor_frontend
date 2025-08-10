import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import "./ChangePassword.css";
import useAuth from "../../hooks/useAuth";
import { toastAlert } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const EyeShowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ display: "block" }}>
    <path d="M16.8998 8.2127H14.6123V5.4377C14.6123 2.8877 12.5498 0.825195 9.99981 0.825195C7.4498 0.825195 5.4248 2.8877 5.4248 5.4377V8.2127H3.1373C1.7123 8.2127 0.549805 9.3377 0.549805 10.6877V16.1252C0.549805 19.9877 3.8873 23.1377 7.9748 23.1377H12.0998C16.1873 23.1377 19.4873 19.9502 19.4873 16.0127V10.6877C19.4873 9.3377 18.3248 8.2127 16.8998 8.2127Z" fill="#0A0A0A" fillOpacity="0.6" />
    <path d="M11.5371 14.7754H8.46211C7.78711 14.7754 7.22461 15.3379 7.22461 16.0129V19.0879C7.22461 19.7629 7.78711 20.3254 8.46211 20.3254H11.5371C12.2121 20.3254 12.7746 19.7629 12.7746 19.0879V16.0129C12.7746 15.3379 12.2121 14.7754 11.5371 14.7754Z" fill="#0A0A0A" fillOpacity="0.6" />
  </svg>
);

const EyeHideIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ display: "block" }}>
    <path d="M16.9002 8.2127H14.6127V5.4377C14.6127 2.8877 12.5502 0.825195 10.0002 0.825195C7.45019 0.825195 5.4252 2.8877 5.4252 5.4377C5.4252 5.8877 5.8002 6.3002 6.2877 6.3002C6.7752 6.3002 7.1502 5.9252 7.1502 5.4377C7.1502 3.8252 8.4627 2.5127 10.0752 2.5127C11.6877 2.5127 13.0002 3.8252 13.0002 5.4377V8.2127H3.1002C1.6752 8.2127 0.512695 9.3377 0.512695 10.6877V16.1252C0.512695 19.9877 3.8502 23.1377 7.9377 23.1377H12.0627C16.1502 23.1377 19.4502 19.9502 19.4502 16.0127V10.6877C19.4877 9.3377 18.3252 8.2127 16.9002 8.2127Z" fill="#0A0A0A" fillOpacity="0.6" />
    <path d="M11.5376 14.7754H8.4626C7.7876 14.7754 7.2251 15.3379 7.2251 16.0129V19.0879C7.2251 19.7629 7.7876 20.3254 8.4626 20.3254H11.5376C12.2126 20.3254 12.7751 19.7629 12.7751 19.0879V16.0129C12.7751 15.3379 12.2126 14.7754 11.5376 14.7754Z" fill="#0A0A0A" fillOpacity="0.6" />
  </svg>
);

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { changePasswordAdmin } = useAuth();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    const newErrors = {};

    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (!passwordRegex.test(newPassword)) newErrors.newPassword = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await changePasswordAdmin({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response?.success) {
        toastAlert("success", response.message || "Password changed successfully.");
        setShowSuccess(true);
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        navigate("/");
      } else {
        toastAlert("warning", response.message || "Password change failed.");
      }
    } catch (error) {
      const errMessage = error.response?.data?.message || "Failed to change password. Please try again.";
      toastAlert("error", errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Change Password">
      <Container fluid className="d-flex justify-content-center mt-4">
        <Card className="col-md-6 mt-5 border-0 shadow rounded-4 p-4">
          <CardHeader className="text-center bg-white border-0">
            <h4>Change Password</h4>
          </CardHeader>
          <CardBody>
            {showSuccess && <Alert variant="success">Password changed successfully!</Alert>}
            <Form onSubmit={handleSubmit}>
              {Object.keys(formData).map((field) => (
                <Form.Group className="mb-4" key={field}>
                  <Form.Label>
                    {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm Password"}
                  </Form.Label>
                  <InputGroup className={`border rounded ${errors[field] ? "border-danger" : "border-secondary"}`}>
                    <Form.Control
                      type={showPasswords[field] ? "text" : "password"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      placeholder={
                        field === "currentPassword"
                          ? "Current password"
                          : field === "newPassword"
                          ? "New password"
                          : "Confirm new password"
                      }
                      className="py-3 border-0"
                    />
                    <InputGroup.Text
                      className="bg-white border-0 me-1"
                      onClick={() => togglePassword(field)}
                      style={{ cursor: "pointer", border: errors[field] ? "1px solid #dc3545" : "" }}
                    >
                      {showPasswords[field] ? <EyeHideIcon /> : <EyeShowIcon />}
                    </InputGroup.Text>
                  </InputGroup>
                  {errors[field] && <div className="text-danger mt-1">{errors[field]}</div>}
                </Form.Group>
              ))}
              <Button variant="dark" type="submit" className="float-end" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </MainLayout>
  );
}

export default ChangePassword;
