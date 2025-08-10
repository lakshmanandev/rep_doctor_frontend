import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import { ImAttachment } from "react-icons/im";
import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { IoChevronBack } from "react-icons/io5";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import log from "../../../utils/logger";

function SupportTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getSupportTicketDetails,
    postSupportTicketmessage,
    updateTicketStatus,
  } = useAuth();
  const { user } = useContext(AuthContext);

  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [closeModel, setCloseModel] = useState(false);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSupportTicketDetails(id);
        setTicketDetails(data);
        setIsClosed(data?.data?.status === "close");

        const apiMessages =
          data?.data?.messages?.map((msg) => ({
            text: msg.ticketMessage,
            image: msg.ticketFiles?.[0] || null,
            sender: msg.adminId ? "admin" : "user",
            date: msg.date,
          })) || [];

        setMessages(apiMessages);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError(err.message || "Failed to load ticket details.");
        setTicketDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketDetails();
    } else {
      setLoading(false);
      setError("No ticket ID provided.");
    }
  }, [id]);

  // Fixed image upload function
  const uploadImageToAdrox = async (imageFile) => {
    setUploadingImage(true);
    try {
      log("Starting image upload to Adrox API...");
      log("File details:", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });

      const formData = new FormData();
      formData.append("images", imageFile);

      // Log FormData contents for debugging
      log("FormData entries:");
      for (let pair of formData.entries()) {
        log(pair[0], pair[1]);
      }

      const response = await axios.post(
        "https://adrox.ai/api/image-save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      log("Upload response:", response);
      log("Response data:", response.data);

      if (
        response.data &&
        response.data.status === true &&
        response.data.message
      ) {
        log("Image uploaded successfully:", response.data.message);
        return response.data.message; // This is the URL
      } else {
        console.error("Unexpected response format:", response.data);
        throw new Error("Invalid response format from image upload API");
      }
    } catch (error) {
      console.error("Image upload error:", error);

      if (error.response) {
        console.error("Server error details:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        throw new Error(
          `Upload failed: ${error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        console.error("Network error - no response received:", error.request);
        throw new Error("Network error: Unable to reach the server");
      } else {
        console.error("Request setup error:", error.message);
        throw new Error(`Request error: ${error.message}`);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput && !selectedImage) {
      alert("Please enter a message or upload an image.");
      return;
    }

    let imageUrl = null;

    // Upload image first if selected
    if (selectedImage) {
      try {
        log("Uploading image before sending message...");
        imageUrl = await uploadImageToAdrox(selectedImage);
        log("Image uploaded successfully, URL:", imageUrl);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert(`Failed to upload image: ${err.message}`);
        return;
      }
    }

    try {
      const payload = {
        ticketId: ticketDetails?.data?.ticketId,
        adminId: user.id,
        ticketMessage: trimmedInput,
        ticketFiles: imageUrl ? [imageUrl] : null,
      };

      log("Sending message with payload:", payload);

      const response = await postSupportTicketmessage(id, payload);
      log("Message sent successfully:", response);

      const newMsg = {
        sender: "admin",
        text: response.data.ticketMessage,
        image: response.data.ticketFiles?.[0] || imageUrl,
        date: response.data.date,
      };

      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      setSelectedImage(null);
      setPreviewImage(null);

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(`Message not sent: ${err.message || "Please try again."}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    log("File selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAttachClick = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.click();
  };

  if (loading) {
    return (
      <MainLayout title="Loading Ticket...">
        <Container className="text-center py-5">
          <h3>Loading ticket details...</h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </MainLayout>
    );
  }

  const handleCloseTicketMain = () => {
    setCloseModel(true);
    log("Modal open triggered");
  };

  const handleCloseTicket = async () => {
    try {
      const payload = {
        userId: user.id,
        userType: "driver", // assuming 'driver' type
        status: "close",
      };

      const response = await updateTicketStatus(
        ticketDetails?.data?.ticketId,
        payload
      );

      if (response?.data?.status === "close") {
        setIsClosed(true);

        // Update ticket details locally
        setTicketDetails((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            status: "close",
          },
        }));
      }

      setCloseModel(false);
    } catch (err) {
      console.error("Error closing the ticket:", err);
      alert("Could not close the ticket. Please try again.");
    }
  };

  if (error) {
    return (
      <MainLayout title="Error">
        <Container className="text-center py-5">
          <p className="lead text-danger">{error}</p>
          <Button
            variant="primary"
            onClick={() => navigate("/support-tickets")}
          >
            Back to Tickets
          </Button>
        </Container>
      </MainLayout>
    );
  }

  if (!ticketDetails) {
    return (
      <MainLayout title="Ticket Not Found">
        <Container className="text-center py-5">
          <h3>Ticket with ID "{id}" not found.</h3>
          <Button
            variant="primary"
            onClick={() => navigate("/support-tickets")}
          >
            Back to Tickets
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Ticket Details">
      <Container fluid className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white text-dark d-flex justify-content-between align-items-center p-3">
            <div className="d-flex justify-content-between align-items-center">
              <IoChevronBack
                className="me-3"
                size={25}
                onClick={() => navigate("/support-tickets")}
                style={{ cursor: "pointer" }}
              />
              <h4>Ticket Number: {ticketDetails.data.ticketId}</h4>
            </div>
            <Button
              variant={isClosed ? "outline-secondary" : "danger"}
              disabled={isClosed}
              onClick={() => handleCloseTicketMain()}
            >
              {isClosed ? "Ticket Closed" : "Close Ticket"}
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6} className="p-3">
                <strong>User Info: </strong>
                <span className="d-inline-flex justify-content-start flex-wrap flex-column align-content-center align-items-center">
                  <div> {ticketDetails.data.userId} </div>
                  <div> {ticketDetails.data.userId} </div>
                  {/* <div> {ticketDetails.user.firstname} </div> 
                  <div> {ticketDetails.user.email} </div> */}
                </span>
              </Col>
              <Col md={6} className="p-3">
                <strong>Subject: </strong>
                {ticketDetails.data.ticketSubject}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="p-3">
                <strong>Date: </strong>
                {ticketDetails.data.createdAt
                  ? format(
                    parseISO(ticketDetails.data.createdAt),
                    "hh:mm a, dd/MM/yyyy"
                  )
                  : "N/A"}
              </Col>
              <Col md={6} className="p-3 d-flex align-items-center gap-3">
                <strong>Status: </strong>
                <span
                  className={`bg-opacity-10 px-3 pb-1 w-10 text-center d-inline-flex align-items-center justify-content-center gap-2 fw-bold rounded-pill ${ticketDetails.data.status === "open"
                    ? "bg-success text-success"
                    : "bg-danger text-danger"
                    }`}
                >
                  {ticketDetails.data.status || "N/A"}
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3 border-0">
          <CardBody className="d-flex flex-column" style={{ height: "30rem" }}>
            <div className="border border-1 rounded p-4 mb-3 flex-grow-1 overflow-auto">
              {messages.map((msg, index) => (
                <Row key={index} className="mb-4">
                  <Col
                    xs={12}
                    className={`text-${msg.sender === "admin" ? "end" : "start"
                      }`}
                  >
                    <div
                      className={`d-inline-block p-2 rounded ${msg.sender === "admin"
                        ? "bg-light text-warning-emphasis"
                        : "bg-light text-info-emphasis"
                        }`}
                    >
                      {msg.text && <div>{msg.text}</div>}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            cursor: "pointer",
                          }}
                          className="mt-2 rounded"
                          onClick={() => {
                            setModalImageSrc(msg.image);
                            setShowImageModal(true);
                          }}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              ))}
            </div>

            {!isClosed && (
              <>
                {previewImage && (
                  <Row className="mb-3">
                    <Col xs={12} sm={8} md={6} lg={4} xl={3}>
                      <div className="p-3 border border-2 border-dashed rounded bg-light position-relative">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={removeImage}
                          className="position-absolute top-0 end-0 rounded-circle p-1 m-1 d-flex align-items-center justify-content-center"
                          style={{
                            width: "28px",
                            height: "28px",
                            transform: "translate(25%, -25%)",
                            zIndex: 10,
                          }}
                        >
                          <AiOutlineClose size={12} />
                        </Button>
                        <div className="text-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{
                              maxHeight: "120px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}

                <Form.Control
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />

                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-end-0"
                    disabled={uploadingImage}
                  />
                  <Button
                    onClick={handleAttachClick}
                    title="Attach Image"
                    className="border-0 border-top border-bottom bg-secondary"
                    disabled={uploadingImage}
                  >
                    <ImAttachment className="border-0" />
                  </Button>
                  <Button
                    variant="dark"
                    onClick={sendMessage}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploading...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </InputGroup>
              </>
            )}

            {isClosed && (
              <div className="text-center">
                Ticket is Closed by {ticketDetails.data.ticketCloseBy} at
                {ticketDetails.data.closedAt
                  ? format(
                    parseISO(ticketDetails.data.closedAt),
                    " hh:mm a, dd/MM/yyyy"
                  )
                  : "N/A"}
              </div>
            )}
          </CardBody>
        </Card>

        <Modal
          show={showImageModal}
          onHide={() => setShowImageModal(false)}
          centered
          size="lg"
          className="image-modal border-0 rounded-4"
        >
          <Modal.Header closeButton className="bg-secondary-subtle">
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-2 bg-secondary-subtle text-white">
            {modalImageSrc && (
              <Zoom>
                <img
                  src={modalImageSrc}
                  alt="Modal Preview"
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "80vh",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </Zoom>
            )}
          </Modal.Body>
        </Modal>

        {closeModel && (
          <Modal
            show={closeModel}
            onHide={() => setCloseModel(false)}
            centered
            size="md"
            className="border-0 rounded-4"
          >
            <ModalHeader
              closeButton
              className="m-0 d-flex justify-content-center align-content-center fw-normal"
            >
              Close Ticket Confirmation
            </ModalHeader>
            <ModalBody className="d-flex flex-column p-3">
              <div className="mb-2 fw-semibold lead">
                Are you sure to close the ticket
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  variant="danger"
                  rounded
                  onClick={() => handleCloseTicket()}
                >
                  Close Ticket
                </Button>
              </div>
            </ModalBody>
          </Modal>
        )}
      </Container>
    </MainLayout>
  );
}

export default SupportTicketDetails;
