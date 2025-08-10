import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContactSupport.css';
import bgimg from '../../assets/images/vendorLoginBg.jpg';
import useAuth from '../../hooks/useAuth';
import { toastAlert } from '../../utils/toast';

function ContactSupport() {
    const { contactSupport } = useAuth();
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        issueType: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setLoading(true);

        const response = await contactSupport(formData);
        setLoading(false);
        if (response.success) {
            toastAlert('success', response.message || 'Support request submitted successfully');
            setFormData({ email: '', issueType: '', subject: '', message: '' });
            setValidated(false);
        } else {
            toastAlert('error', response.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="page-container">
            <img src={bgimg} alt="City background" className="background-image" />

            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="hoppr-card p-4 w-100" style={{ maxWidth: '500px' }}>
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h2 className="app-title fw-bold">AKC</h2>
                            <p className="text-muted">Contact Support</p>
                        </div>

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email.
                                    </Form.Control.Feedback>
                                    <span
                                        className="position-absolute"
                                        style={{
                                            right: "16px",
                                            top: "12px",
                                            zIndex: 2,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {/* Email icon */}
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
                                    </span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="issueType">
                                <Form.Label>Issue Type</Form.Label>
                                <Form.Select
                                    value={formData.issueType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select an issue type</option>
                                    <option value="account">Account Access</option>
                                    <option value="billing">Billing Issues</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select an issue type.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="subject">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Brief description of your issue"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a subject.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="message">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Please describe your issue in detail"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide details about your issue.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                variant="dark"
                                type="submit"
                                className="submit-button w-100 py-2 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <Link to="/login" className="fw-bold text-body text-decoration-none">
                                Back to Login
                            </Link>
                        </div>
                    </Card.Body>

                    <Card.Footer className="bg-white text-center border-0 pt-3 pb-2">
                        <small className="text-muted">
                            © 2025 AKC /{' '}
                            <a
                                href="#privacy-terms"
                                className="text-body fw-bold text-decoration-none"
                            >
                                Privacy & Terms of Use
                            </a>
                        </small>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );
}

export default ContactSupport;
