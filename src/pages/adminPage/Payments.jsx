// Payments.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';
import MainLayout from '../../components/layout/MainLayout';
import useAuth from '../../hooks/useAuth';
import { toastAlert } from '../../utils/toast';
import FloatingInput from '../../components/common/forms/FloatingInput';
import SwitchToggle from '../../components/common/forms/SwitchToggle';
import TwoFactorAuth from './TwoFactorAuth';

const INITIAL_FORM_DATA = {
  public_key: '',
  secret_key: '',
  deposit_address: '',
  trc20_address: '',
  trc20_status: false,
  erc20_address: '',
  erc20_status: false,
  bep20_address: '',
  bep20_status: false,
  polygon_address: '',
  polygon_status: false,
  tron_public_key: '',
  tron_secret_key: ''
};

const Payments = () => {
  const { UpdatePaymentConfig, getPaymentConfig } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [verified, setVerified] = useState(false);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateAddress = (field, value) => {
    const newErrors = {};
    if (!value) return newErrors;

    switch (field) {
      case 'trc20_address':
        if (!/^T[a-zA-Z0-9]{33}$/.test(value)) {
          newErrors[field] = 'Invalid TRC20 address (must start with T and be 34 characters)';
        }
        break;
      case 'erc20_address':
      case 'bep20_address':
      case 'polygon_address':
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          newErrors[field] = `Invalid address for ${field.replace('_', ' ').toUpperCase()} (must start with 0x and be 42 characters)`;
        }
        break;
      default:
        break;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const allErrors = {
      ...validateAddress('trc20_address', formData.trc20_address),
      ...validateAddress('erc20_address', formData.erc20_address),
      ...validateAddress('bep20_address', formData.bep20_address),
      ...validateAddress('polygon_address', formData.polygon_address),
    };

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      toastAlert('error', 'Please fix the highlighted errors.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await UpdatePaymentConfig(formData);

      if (response.success) {
        toastAlert("success", response.message || "Payment config updated successfully");
      } else {
        const errors = Array.isArray(response.errors) ? response.errors : [{ msg: response.message }];
        errors.forEach(err => toastAlert("error", err.msg || "Something went wrong"));
      }
    } catch (error) {
      toastAlert("error", error.response?.data?.message || error.message || "Update failed");
      console.error('Error updating config:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await getPaymentConfig();
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toastAlert("error", "Failed to fetch config");
      console.error(error);
    }
  }, [getPaymentConfig]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    fetchData();
  };

  return (
    <MainLayout title="Create Payment Configuration">
      {!verified ? (
      <TwoFactorAuth onVerify={() => setVerified(true)} />
      ) : (
      <Container className="py-4 px-md-5">
        <Card className="border-0 rounded-5 shadow p-2 mt-5">
          <Card.Header className="bg-white border-0 mb-4">
            <h4 className="fw-bold mb-0 text-center">Update Payment Configuration</h4>
          </Card.Header>
          <Container className="form-md">
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <FloatingInput id="public_key" label="Public Key (BNB, POLYGON)" value={formData.public_key} onChange={(e) => handleFormChange('public_key', e.target.value)} />
                <FloatingInput id="secret_key" label="Secret Key (BNB, POLYGON)" value={formData.secret_key} onChange={(e) => handleFormChange('secret_key', e.target.value)} />
                <FloatingInput id="tron_public_key" label="Tron Public Key" value={formData.tron_public_key} onChange={(e) => handleFormChange('tron_public_key', e.target.value)} />
                <FloatingInput id="tron_secret_key" label="Tron Secret Key" value={formData.tron_secret_key} onChange={(e) => handleFormChange('tron_secret_key', e.target.value)} />
                <FloatingInput id="trc20_address" label="TRC20 Address (Tron Network)" value={formData.trc20_address} onChange={(e) => handleFormChange('trc20_address', e.target.value)} error={errors.trc20_address} />
                <SwitchToggle id="trc20_status" label="TRC20 Status" checked={formData.trc20_status} onChange={(e) => handleFormChange('trc20_status', e.target.checked)} />
                <FloatingInput id="erc20_address" label="ERC20 Address (Ethereum Network)" value={formData.erc20_address} onChange={(e) => handleFormChange('erc20_address', e.target.value)} error={errors.erc20_address} />
                <SwitchToggle id="erc20_status" label="ERC20 Status" checked={formData.erc20_status} onChange={(e) => handleFormChange('erc20_status', e.target.checked)} />
                <FloatingInput id="bep20_address" label="BEP20 Address (Binance Smart Chain)" value={formData.bep20_address} onChange={(e) => handleFormChange('bep20_address', e.target.value)} error={errors.bep20_address} />
                <SwitchToggle id="bep20_status" label="BEP20 Status" checked={formData.bep20_status} onChange={(e) => handleFormChange('bep20_status', e.target.checked)} />
                <FloatingInput id="polygon_address" label="Polygon Address (Matic Network)" value={formData.polygon_address} onChange={(e) => handleFormChange('polygon_address', e.target.value)} error={errors.polygon_address} />
                <SwitchToggle id="polygon_status" label="Polygon Status" checked={formData.polygon_status} onChange={(e) => handleFormChange('polygon_status', e.target.checked)} />
              </Row>
              <div className="d-flex justify-content-center mt-3 mb-2">
                <Button variant="outline-secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Payment Config'}
                </Button>
              </div>
            </Form>
          </Container>
        </Card>
      </Container>
      )}
    </MainLayout>
  );
};

export default Payments;
