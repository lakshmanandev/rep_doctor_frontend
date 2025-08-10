import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import MainLayout from '../../../components/layout/MainLayout';
import useAuth from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { toastAlert } from '../../../utils/toast';
import { Copy } from 'react-feather';
import AddingLoader from '../../../components/common/AddingLoader';
import log from '../../../utils/logger';


const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    status: '1',
    vendorId: '',
};

const EmployeeAddEdit = () => {
    const navigate = useNavigate();
    const { AddEmployee, getVendorsName, updateEmployee, getEmployeeByIdEdit } = useAuth();
    const [vendorList, setVendorList] = useState([]);
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [submitting, setSubmitting] = useState(false);

    const [showUserModal, setShowUserModal] = useState(false);
    const [createdUser, setCreatedUser] = useState(null);

    const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
    const [showCredTooltip, setShowCredTooltip] = useState(false);
    const [showUrlTooltip, setShowUrlTooltip] = useState(false);

    const handleCopyCredentials = () => {
        const creds = `ID: ${createdUser.unique_id}\nPassword: ${createdUser.password}`;
        navigator.clipboard.writeText(creds);
        setShowCredTooltip(true);
        setTimeout(() => setShowCredTooltip(false), 2000);
    };

    const handleCopyLoginURL = () => {
        const loginUrl = `${window.location.origin}/${createdUser.vendor_name}/${createdUser.username}/login`;
        navigator.clipboard.writeText(loginUrl);
        setShowUrlTooltip(true);
        setTimeout(() => setShowUrlTooltip(false), 2000);
    };

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleFormChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {

            const backendPayload = {
                vendorId: formData.vendorId,
                username: formData.name,
                email: formData.email,
                phone: formData.mobileNumber,
                user_status: formData.status,
            };


            let response;
            if (isEdit) {
                response = await updateEmployee(id, backendPayload);
            } else {
                response = await AddEmployee(backendPayload);
            }

            if (response.success) {
                toastAlert("success", response.message || `Employee ${isEdit ? 'updated' : 'added'} successfully`);
                if (!isEdit && response.employee) {
                    setCreatedUser(response.employee);
                    setShowUserModal(true);
                    setFormData(INITIAL_FORM_DATA);
                }

            } else {
                toastAlert("error", response.message || "Something went wrong");
            }
        } catch (error) {
            const errorData = error.response?.data;

            if (errorData?.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach(err => {
                    toastAlert("error", err.msg || "Validation error");
                });
            } else {
                const errorMsg = errorData?.message || error.message || "Failed to save vendor";
                toastAlert("error", errorMsg);
            }

        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchVendorsName = async () => {
            try {
                const res = await getVendorsName();
                log("res", res)
                if (res.success) {
                    setVendorList(res?.vendors);
                } else {
                    toastAlert('error', 'Failed to fetch vendors');
                }
            } catch (err) {
                toastAlert('error', 'Error loading vendors');
            }
        };
        fetchVendorsName();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoadingEmployeeData(true);
                const response = await getEmployeeByIdEdit(id);
                log("response", response)
                if (response.success) {
                    const emp = response?.data?.employees[0] || null;
                    setFormData({
                        name: emp.username || '',
                        email: emp.email || '',
                        mobileNumber: emp.phone || '',
                        status: emp.user_status || '1',
                        vendorId: emp.parent_id || '',
                    });
                } else {
                    toastAlert('error', 'Employee not found');
                }
            } catch (err) {
                toastAlert('error', 'Failed to load employee');
            } finally {
                setLoadingEmployeeData(false)
            }
        };

        if (isEdit || id) fetchEmployee();
    }, [id, isEdit]);


    return (
        <MainLayout title="Create Employee">
            {submitting && (
                <AddingLoader />
            )}
            <Container className="py-4 px-md-5">
                <Card className="border-0 rounded-5 shadow p-5 mt-5" style={{ backgroundColor: '#ffffff' }}>
                    <Card.Header className="bg-white border-0 mb-4">
                        <h4 className="fw-bold mb-0 text-primary">
                            {isEdit ? 'Edit Employee' : 'Add New Employee'}
                        </h4>
                    </Card.Header>

                    {loadingEmployeeData ? (
                        <div className="text-center py-5">
                            <span className="spinner-border text-primary" role="status" />
                            <p className="mt-3">Loading Employee data...</p>
                        </div>
                    ) : (
                        <Container className="form-md">
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-4">

                                    <Col md={6} sm={12}>
                                        <div className="form-group">
                                            <select
                                                id="form_status"
                                                className={`form-controlll ${formData.status ? 'has-value' : ''}`}
                                                value={formData.vendorId}
                                                onChange={(e) => handleFormChange('vendorId', e.target.value)}
                                                required
                                                disabled={submitting}
                                            >
                                                {!isEdit &&
                                                    <option value="">Select Vendor</option>
                                                }

                                                {vendorList
                                                    .filter(vendor => !isEdit || vendor.id === formData.vendorId) // <-- filter only if editing
                                                    .map(vendor => (
                                                        <option key={vendor.encrypted_id} value={vendor.encrypted_id}>
                                                            {vendor.username}
                                                        </option>
                                                    ))}

                                            </select>
                                            <label className="labell" htmlFor="form_status">
                                                Vendor<span className="gl-form-asterisk"></span>
                                            </label>
                                        </div>

                                    </Col>

                                    {/* Name */}
                                    <Col md={6} sm={12}>
                                        <div className="form-group">
                                            <input
                                                id="form_name"
                                                className="form-controll"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleFormChange('name', e.target.value)}
                                                required
                                                disabled={submitting}
                                            />
                                            <label className="labell" htmlFor="form_name">
                                                Name<span className="gl-form-asterisk"></span>
                                            </label>
                                        </div>
                                    </Col>

                                    {/* Email */}
                                    <Col md={6} sm={12}>
                                        <div className="form-group">
                                            <input
                                                id="form_email"
                                                className="form-controll"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleFormChange('email', e.target.value)}
                                                required
                                                disabled={submitting}
                                            />
                                            <label className="labell" htmlFor="form_email">
                                                Email<span className="gl-form-asterisk"></span>
                                            </label>
                                        </div>
                                    </Col>

                                    {/* Mobile Number */}
                                    <Col md={6} sm={12}>
                                        <div className="form-group">
                                            <input
                                                id="form_mobile"
                                                className="form-controll"
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                maxLength={10}
                                                value={formData.mobileNumber}
                                                onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                                                required
                                                disabled={submitting}
                                            />
                                            <label className="labell" htmlFor="form_mobile">
                                                Mobile Number<span className="gl-form-asterisk"></span>
                                            </label>
                                        </div>
                                    </Col>

                                    {/* Status */}
                                    <Col md={6} sm={12}>
                                        <div className="form-group">
                                            <select
                                                id="form_status"
                                                className={`form-controlll ${formData.status ? 'has-value' : ''}`}
                                                value={formData.status}
                                                onChange={(e) => handleFormChange('status', e.target.value)}
                                                required
                                                disabled={submitting}
                                            >
                                                <option value="" disabled hidden>Select status</option>
                                                <option value="1">Active</option>
                                                <option value="2">Inactive</option>
                                            </select>
                                            <label className="labell" htmlFor="form_status">
                                                Status<span className="gl-form-asterisk"></span>
                                            </label>
                                        </div>

                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-between mt-5">
                                    <Button variant="outline-secondary" onClick={() => navigate('/admin/employees')}>Back</Button>
                                    <div>
                                        <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/admin/employees')}>Cancel</Button>
                                        <Button variant="primary" type="submit" disabled={submitting}>
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" style={{ width: '0.9rem', height: '0.9rem' }} role="status" aria-hidden="true"></span>
                                                    {isEdit ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                isEdit ? 'Update Employee' : 'Create Employee'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </Container>
                    )}

                    <Modal
                        backdrop="static"
                        keyboard={false}
                        show={showUserModal} onHide={() => setShowUserModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>New Employee Created Successfully</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {createdUser && (
                                <div className="text-center">
                                    <p className="fw-semibold mb-2">
                                        <span className="text-muted">EmployeeID:</span> {createdUser.unique_id}
                                    </p>
                                    <p className="fw-semibold mb-2">
                                        <span className="text-muted">Password:</span> {createdUser.password}
                                    </p>

                                    {/* Construct login URL */}
                                    <p className="fw-semibold mb-3">
                                        <span className="text-muted">Login URL:</span>{' '}
                                        <a
                                            href={`${window.location.origin}/${createdUser.vendor_name}/${createdUser.username}/login`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {`${window.location.origin}/${createdUser.vendor_name}/${createdUser.username}/login`}
                                        </a>
                                    </p>

                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        <OverlayTrigger
                                            placement="top"
                                            show={showCredTooltip}
                                            overlay={<Tooltip id="tooltip-cred">Copied!</Tooltip>}
                                        >
                                            <Button variant="outline-primary" onClick={handleCopyCredentials}>
                                                <Copy size={16} className="me-2" /> Copy Credentials
                                            </Button>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="top"
                                            show={showUrlTooltip}
                                            overlay={<Tooltip id="tooltip-url">Copied!</Tooltip>}
                                        >
                                            <Button variant="outline-secondary" onClick={handleCopyLoginURL}>
                                                <Copy size={16} className="me-2" /> Copy Login URL
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal>

                </Card>
            </Container>
        </MainLayout>
    );
};

export default EmployeeAddEdit;