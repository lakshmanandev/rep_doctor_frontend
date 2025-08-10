// components/common/ResetPasswordModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ResetPasswordModal = ({
  show,
  onHide,
  onSubmit,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="form-group">
            <input
              id="form_password"
              className="form-controll"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="labell" htmlFor="form_password">
              New Password<span className="gl-form-asterisk"></span>
            </label>
          </div>

          <div className="form-group">
            <input
              id="form_confirm_password"
              className="form-controll"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label className="labell" htmlFor="form_confirm_password">
              Confirm Password<span className="gl-form-asterisk"></span>
            </label>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPasswordModal;
