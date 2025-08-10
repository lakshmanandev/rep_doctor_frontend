import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import useAuth from "../../hooks/useAuth";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
  Modal,
  Form,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteSweep } from "react-icons/md";

function FAQ() {
  const { getFAQs, newFAQ, updateFAQ, deleteFAQ } = useAuth();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    type: "",
  });
  const [selectedType, setSelectedType] = useState("All");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [confirmWord, setConfirmWord] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await getFAQs();
      setFaqs(res.data.faqs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFAQ(null);
    setFormData({ question: "", answer: "", type: "" });
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      type: faq.type || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (faq) => {
    const word = uuidv4().split("-")[0];
    setFaqToDelete(faq);
    setConfirmWord(word);
    setConfirmationText("");
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFAQ) {
        const updated = await updateFAQ({ id: editingFAQ._id, ...formData });
        setFaqs((prev) =>
          prev.map((f) => (f._id === editingFAQ._id ? updated.data : f))
        );
      } else {
        const added = await newFAQ(formData);
        setFaqs((prev) => [added.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmationText !== confirmWord) return;
    try {
      await deleteFAQ(faqToDelete._id);
      setFaqs(faqs.filter((faq) => faq._id !== faqToDelete._id));
      setShowDeleteModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const filteredFaqs =
    selectedType === "All"
      ? faqs
      : faqs.filter((faq) => faq.type === selectedType);

  return (
    <MainLayout title="Frequently Asked Questions">
      <Container fluid className="mt-5">
        <Row className="align-items-center">
          <Col>
            <div className="overflow-auto">
              <div className="btn-group flex-nowrap d-flex" role="group">
                {["All", "Driver", "Customer"].map((type) => (
                  <div
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`text-nowrap m-2 px-4 bton ${selectedType === type ? "u_primary" : "u_light"
                      }`}
                    style={{ cursor: "pointer" }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <Card className="mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h3>Frequently Asked Questions</h3>
            <Button variant="primary" onClick={handleAdd}>
              Add New FAQ
            </Button>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Spinner animation="border" />
            ) : filteredFaqs.length === 0 ? (
              <p>No FAQs found.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <Row
                  key={faq._id}
                  className="border-bottom py-3 align-items-center"
                >
                  <Col md={9}>
                    <h5>{faq.question}</h5>
                    <p className="text-muted">{faq.answer}</p>
                    <small className="text-info">Type: {faq.type}</small>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button
                      variant="secondary"
                      className="me-2 d-inline-flex align-items-center"
                      onClick={() => handleEdit(faq)}
                    >
                      <FiEdit3 className="me-2" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(faq)}
                      className="d-inline-flex align-items-center bg-white text-danger"
                    >
                      <MdOutlineDeleteSweep size={20} className="me-2" />
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="">Select a Type</option>
                <option value="Driver">Driver</option>
                <option value="Customer">Customer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              {editingFAQ ? "Update FAQ" : "Add FAQ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To delete this FAQ, type the word: <strong>{confirmWord}</strong>
          </p>
          <Form.Control
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={confirmationText !== confirmWord}
          >
            Delete FAQ
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
}

export default FAQ;
