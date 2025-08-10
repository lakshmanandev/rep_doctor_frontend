import React, { useState, useCallback, useRef, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import FloatingInput from '../../components/common/forms/FloatingInput';
import useAuth from '../../hooks/useAuth';
import { uploadImageToAdrox } from '../../utils/uploadImageToAdrox';
import { useNavigate } from 'react-router-dom';
import { toastAlert } from '../../utils/toast';

const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    profilePic: null,
    profilePicPreview: '',
    dbPicStatus: false,
};

const AdminProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef();
    const { UpdateAdminProfile, getAdminProfile } = useAuth();


    const handleFormChange = useCallback((field, value) => {
        if (field === 'profilePic') {
            if (value && value instanceof File) {
                if (formData.profilePicPreview.startsWith('blob:')) {
                    URL.revokeObjectURL(formData.profilePicPreview);
                }
                const previewURL = URL.createObjectURL(value);
                setFormData(prev => ({
                    ...prev,
                    profilePic: value,
                    profilePicPreview: previewURL,
                    dbPicStatus: false,
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    profilePic: null,
                    profilePicPreview: '',
                    dbPicStatus: false,
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    }, [formData.profilePicPreview]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let imageUrl = null;

            // Upload image if selected
            if (formData.profilePic && !formData.dbPicStatus) {
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
                profile: imageUrl || (formData.dbPicStatus ? formData.profilePic : null),
            };

            const response = await UpdateAdminProfile(backendPayload);
            if (response.success) {
                toastAlert("success", response.message || "Profile updated successfully");
                navigate("/dashboard");
            } else {
                toastAlert("error", response.message || "Something went wrong");
            }
        } catch (error) {
            console.error('Error updating config:', error);
            toastAlert("error", error.response?.data?.message || error.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await getAdminProfile();
            if (response.success) {
                const admin = response.data;
                setFormData({
                    name: admin.username || '',
                    email: admin.email || '',
                    profilePic: admin.profile || null,
                    profilePicPreview: admin.profile || '',
                    dbPicStatus: !!admin.profile,
                });
            }
        } catch (error) {
            toastAlert("error", "Failed to fetch config");
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <MainLayout title="Site Settings">
            <Container className="py-4 px-md-5">
                <Card className="p-5 border-0 rounded-4 shadow mt-4">
                    <h4 className="text-primary fw-bold mb-4">Admin Profile</h4>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <FloatingInput
                                id="form_name"
                                label="Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                required
                            />

                            <FloatingInput
                                id="form_email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                required
                            />

                            <Col md={6} sm={12}>
                                <div className="form-group custom-file-group">
                                    <div className="custom-file-wrapper">
                                        <label htmlFor="form_profile" className="custom-file-label labell">
                                            Profile Picture
                                        </label>
                                        <div
                                            className="custom-file-input-display"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {/* {formData.profilePic instanceof File
                                                ? formData.profilePic.name
                                                : "Choose file"} */}
                                        </div>
                                        <input
                                            id="form_profile"
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            ref={fileInputRef}
                                            onChange={(e) => handleFormChange('profilePic', e.target.files[0])}
                                            className="d-none"
                                        />
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
                                                    border: '1px solid #ccc',
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
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col md={12} className="text-end mt-4">
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" style={{ width: '0.8rem', height: '0.8rem' }} role="status" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </MainLayout>
    );
};

export default AdminProfile;
