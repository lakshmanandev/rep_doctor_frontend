import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import MainLayout from '../../../components/layout/MainLayout';
import useAuth from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { toastAlert } from '../../../utils/toast';
import { uploadImageToAdrox } from '../../../utils/uploadImageToAdrox';
import { Copy } from 'react-feather';
import AddingLoader from '../../../components/common/AddingLoader';

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  mobileNumber: '',
  status: '1',
  profilePic: null,
  profilePicPreview: '',
};

const VendorAddEdit = () => {
  const navigate = useNavigate();
  const { AddVendor, fetchVendorByIdEdit, updateVendor } = useAuth();
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [submitting, setSubmitting] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const [loadingVendorData, setLoadingVendorData] = useState(false);
  const [showCredTooltip, setShowCredTooltip] = useState(false);
  const [showUrlTooltip, setShowUrlTooltip] = useState(false);

  const handleCopyCredentials = () => {
    const creds = `ID: ${createdUser.unique_id}\nPassword: ${createdUser.password}`;
    navigator.clipboard.writeText(creds);
    setShowCredTooltip(true);
    setTimeout(() => setShowCredTooltip(false), 2000);
  };

  const handleCopyLoginURL = () => {
    const loginUrl = `${window.location.origin}/${createdUser.username}/login`;
    navigator.clipboard.writeText(loginUrl);
    setShowUrlTooltip(true);
    setTimeout(() => setShowUrlTooltip(false), 2000);
  };

  useEffect(() => {
    if (isEdit || id) {
      const fetchVendor = async () => {
        try {
          setLoadingVendorData(true);
          const response = await fetchVendorByIdEdit(id);

          if (response.success && Array.isArray(response?.data.vendors) && response?.data?.vendors.length > 0) {
            const vendor = response?.data?.vendors[0];

            setFormData({
              name: vendor.username || '',
              email: vendor.email || '',
              mobileNumber: vendor.phone || '',
              status: vendor.user_status === 1 ? 'active' : 'inactive',
              profilePic: vendor.profile || null,
              profilePicPreview: vendor.profile || '',
            });
          } else {
            toastAlert("error", "Vendor not found");
          }
        } catch (error) {
          toastAlert("error", "Failed to load vendor data");
          console.error(error);
        } finally {
          setLoadingVendorData(false); // Stop loading
        }
      };

      fetchVendor();
    }
  }, [isEdit, id]);


  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleFormChange = useCallback((field, value) => {
    if (field === 'profilePic') {
      if (value && value instanceof File) {
        const previewURL = URL.createObjectURL(value);
        setFormData(prev => ({
          ...prev,
          profilePic: value,
          profilePicPreview: previewURL
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          profilePic: null,
          profilePicPreview: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Start loader

    try {
      let imageUrl = formData.profilePicPreview;

      // ✅ FIXED: Only upload if it's a File
      if (formData.profilePic instanceof File) {
        try {
          imageUrl = await uploadImageToAdrox(formData.profilePic);
        } catch (err) {
          toastAlert('error', `Failed to upload image: ${err.message}`);
          return;
        }
      }

      // Prepare payload
      const backendPayload = {
        username: formData.name,
        email: formData.email,
        phone: formData.mobileNumber,
        user_status: formData.status,
        profile: imageUrl || null,
      };

      let response;

      if (isEdit) {
        response = await updateVendor(id, backendPayload);
      } else {
        response = await AddVendor(backendPayload);
      }

      if (response.success) {
        toastAlert("success", response.message || `Vendor ${isEdit ? 'updated' : 'added'} successfully`);
        // navigate("/admin/vendors");
        if (!isEdit && response.user) {
          setCreatedUser(response.user);
          setShowUserModal(true);
          setFormData(INITIAL_FORM_DATA);

          //  navigate("/admin/vendors");
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
      setSubmitting(false); // Stop loader no matter what
    }
  };



  return (
    <MainLayout title="Create Vendor">
      {submitting && (
        <AddingLoader />
      )}
      <Container className="py-4 px-md-5">
        <Card className="border-0 rounded-5 shadow p-5 mt-5" style={{ backgroundColor: '#ffffff' }}>
          <Card.Header className="bg-white border-0 mb-4">
            <h4 className="fw-bold mb-0 text-primary">
              {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
            </h4>
          </Card.Header>

          {loadingVendorData ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary" role="status" />
              <p className="mt-3">Loading vendor data...</p>
            </div>
          ) : (

            <Container className="form-md">
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
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
                        <option value="" disabled hidden></option>
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                      <label className="labell" htmlFor="form_status">
                        Status
                      </label>
                    </div>

                  </Col>

                  {/* Profile Picture Upload */}
                  <Col md={6} sm={12}>
                    <div className="form-group custom-file-group">
                      <div className="custom-file-wrapper">


                        <div
                          className="custom-file-input-display"
                          onClick={() => {
                            if (!submitting) fileInputRef.current?.click();
                          }}
                        >
                          {formData.profilePic?.name || "Choose file"}
                        </div>

                        <input
                          id="form_profile"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          ref={fileInputRef}
                          onChange={(e) => handleFormChange('profilePic', e.target.files[0])}
                          className="d-none "
                          disabled={submitting}
                        />

                        <label htmlFor="form_profile" className="custom-file-label labell">
                          Logo
                        </label>
                      </div>


                      {formData.profilePicPreview && (
                        <div style={{ position: 'relative', display: 'inline-block', marginTop: '12px' }}>
                          <img
                            src={formData.profilePicPreview}
                            alt="Preview"
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleFormChange('profilePic', null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#fff',
                              border: '1px solid #ccc',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </Col>

                </Row>

                <div className="d-flex justify-content-between mt-5">
                  <Button variant="outline-secondary" onClick={() => navigate('/admin/vendors')}>Back</Button>
                  <div>
                    <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/admin/vendors')}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" style={{ width: '0.9rem', height: '0.9rem' }} role="status" aria-hidden="true"></span>
                          {isEdit ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEdit ? 'Update Vendor' : 'Create Vendor'
                      )}
                    </Button>

                  </div>
                </div>
              </Form>
            </Container>
          )}
        </Card>

        <Modal
          show={showUserModal}
          backdrop="static"
          keyboard={false}
          onHide={() => setShowUserModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>New Vendor Created Successfully</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createdUser && (
              <div className="text-center">
                <p className="fw-semibold mb-2">
                  <span className="text-muted">VendorID:</span> {createdUser.unique_id}
                </p>
                <p className="fw-semibold mb-2">
                  <span className="text-muted">Password:</span> {createdUser.password}
                </p>
                <p className="fw-semibold mb-3">
                  <span className="text-muted">Login URL:</span>{' '}
                  <a
                    href={`${window.location.origin}/${createdUser.username}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${window.location.origin}/${createdUser.username}/login`}
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



      </Container>
    </MainLayout >
  );
};

export default VendorAddEdit;

