import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import MainLayout from '../../components/layout/MainLayout';
import { toastAlert } from '../../utils/toast';
import useAuth from '../../hooks/useAuth';
import { uploadImageToAdrox } from '../../utils/uploadImageToAdrox';

const INITIAL_DATA = {
    name: '',
    icon: null,
    iconPreview: '',
    logoPreview: '',
    logo: null,
    copyright: '',
    address: '',
    meta_title: '',
    meta_keyword: '',
    meta_description: '',
    phone: '',
    email: '',
    instagram: '',
    twitter: '',
    youtube: '',
    facebook: '',
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
};

const SiteSettings = () => {
    const { getSiteSettings, updateSiteSettings } = useAuth();
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [submitting, setSubmitting] = useState(false);
    const logoInputRef = useRef(null);
    const iconInputRef = useRef(null);

    const handleFormChange = (field, value) => {
        if (["logo", "icon"].includes(field)) {
            if (value instanceof File) {
                const previewURL = URL.createObjectURL(value);
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                    [`${field}Preview`]: previewURL,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [field]: null,
                    [`${field}Preview`]: '',
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await getSiteSettings();
            if (res?.success && res?.data) {
                setFormData((prev) => ({
                    ...prev,
                    ...res.data,
                    logoPreview: res.data.logo || '',
                    iconPreview: res.data.icon || '',
                }));
            } else {
                toastAlert('error', 'Failed to load settings');
            }
        } catch (err) {
            toastAlert('error', 'Error fetching settings');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let iconUrl = formData.iconPreview;
            let logoUrl = formData.logoPreview;

            if (formData.icon instanceof File) {
                iconUrl = await uploadImageToAdrox(formData.icon);
            }
            if (formData.logo instanceof File) {
                logoUrl = await uploadImageToAdrox(formData.logo);
            }

            const payload = {
                ...formData,
                icon: iconUrl,
                logo: logoUrl,
            };

            const res = await updateSiteSettings(payload);
            if (res?.success) {
                toastAlert('success', res.message || 'Settings updated');
                fetchSettings();
            } else {
                toastAlert('error', res.message || 'Failed to update settings');
            }
        } catch (err) {
            toastAlert('error', 'Server error');
        }

        setSubmitting(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <MainLayout title="Site Settings">
            <Container className="py-4 px-md-5">
                <Card className="p-5 border-0 rounded-4 shadow mt-4">
                    <h4 className="text-primary fw-bold mb-4">Site Settings</h4>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            {[
                                { id: 'name', label: 'Name' },
                                { id: 'copyright', label: 'Copyright' },
                                { id: 'address', label: 'Address', md: 12 },
                                { id: 'meta_title', label: 'Meta Title' },
                                { id: 'meta_keyword', label: 'Meta Keywords' },
                                { id: 'meta_description', label: 'Meta Description', md: 12 },
                                { id: 'phone', label: 'Phone' },
                                { id: 'email', label: 'Email', type: 'email' },
                            ].map(({ id, label, md = 6, type = 'text' }) => (
                                <Col md={md} key={id}>
                                    <div className="form-group">
                                        <input
                                            id={`form_${id}`}
                                            className="form-controll"
                                            type={type}
                                            value={formData[id] || ''}
                                            onChange={(e) => handleFormChange(id, e.target.value)}
                                            required
                                        />
                                        <label className="labell" htmlFor={`form_${id}`}>{label}</label>
                                    </div>
                                </Col>
                            ))}

                            {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                                <Col md={6} key={social}>
                                    <div className="form-group">
                                        <input
                                            id={`form_${social}`}
                                            className="form-controll"
                                            type="text"
                                            value={formData[social] || ''}
                                            onChange={(e) => handleFormChange(social, e.target.value)}
                                            required
                                        />
                                        <label className="labell" htmlFor={`form_${social}`}>{social.charAt(0).toUpperCase() + social.slice(1)} URL</label>
                                    </div>
                                </Col>
                            ))}

                            {[
                                { key: 'smtp_host', label: 'SMTP Host' },
                                { key: 'smtp_port', label: 'SMTP Port' },
                                { key: 'smtp_username', label: 'SMTP Username' },
                                { key: 'smtp_password', label: 'SMTP Password', type: 'password' },
                            ].map(({ key, label, type = 'text' }) => (
                                <Col md={6} key={key}>
                                    <div className="form-group">
                                        <input
                                            id={`form_${key}`}
                                            className="form-controll"
                                            type={type}
                                            value={formData[key] || ''}
                                            onChange={(e) => handleFormChange(key, e.target.value)}
                                            required
                                        />
                                        <label className="labell" htmlFor={`form_${key}`}>{label}</label>
                                    </div>
                                </Col>
                            ))}

                            {['logo', 'icon'].map((imgField) => (
                                <Col md={6} key={imgField}>
                                    <div className="form-group">
                                        <div
                                            className="custom-file-input-display"
                                            onClick={() => (imgField === 'logo' ? logoInputRef.current?.click() : iconInputRef.current?.click())}
                                        >Upload {imgField}</div>
                                        <input
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            ref={imgField === 'logo' ? logoInputRef : iconInputRef}
                                            onChange={(e) => handleFormChange(imgField, e.target.files[0])}
                                            className="d-none"
                                        />
                                        <label className="labell">{imgField === 'logo' ? 'Site Logo' : 'Site Icon'}</label>
                                        {formData[`${imgField}Preview`] && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={formData[`${imgField}Preview`]}
                                                    alt="Preview"
                                                    style={{ width: '100px', borderRadius: '6px', border: '1px solid #ccc' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))}

                            <Col md={12} className="text-end mt-4">
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </MainLayout>
    );
};

export default SiteSettings;
