import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Form,
  Pagination,
} from "react-bootstrap";
import { endOfDay, format, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { LuTickets } from "react-icons/lu";
import { IoTicketOutline, IoTodayOutline } from "react-icons/io5";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import { RxEnvelopeClosed } from "react-icons/rx";
import log from "../../../utils/logger";

const FILTERS = [
  { id: 1, name: "All Tickets", apiKey: "allTickets", icon: <LuTickets /> },
  { id: 2, name: "Today", apiKey: "todayTickets", icon: <IoTodayOutline /> },
  { id: 3, name: "Open", apiKey: "openTickets", icon: <FaRegEnvelopeOpen /> },
  {
    id: 4,
    name: "Close",
    apiKey: "closedTickets",
    icon: <RxEnvelopeClosed />,
  },
];

const ROLES = ["All", "Vendors", "Employees"];

function SupportTicket() {
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("All Tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const limit = 10; // You can make this dynamic if needed

  const { getSupportTickets } = useAuth();
  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        role: selectedRole,
        status:
          selectedFilter !== "Today" && selectedFilter !== "All Tickets"
            ? selectedFilter
            : undefined,
        search: searchTerm || undefined,
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? endOfDay(new Date(toDate)).toISOString() : undefined,
        page: currentPage,
        limit,
      };

      if (selectedFilter === "Today") {
        const startOfToday = format(
          startOfDay(new Date()),
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        );
        const endOfToday = format(
          endOfDay(new Date()),
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        );

        params.fromDate = startOfToday;
        params.toDate = endOfToday;
      } else if (selectedFilter === "Open" || selectedFilter === "Close") {
        params.status = selectedFilter.toLowerCase();
      }

      const data = await getSupportTickets(params);

      setTickets(data);

      if (data?.data?.pagination) {
        setTotalPages(data.data.pagination.totalPages);
        setTotalTickets(data.data.pagination.totalTickets);
      } else {
        setTotalPages(1);
        setTotalTickets(0);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [
    getSupportTickets,
    selectedRole,
    selectedFilter,
    searchTerm,
    fromDate,
    toDate,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTickets();
  }, [selectedRole, selectedFilter, searchTerm, fromDate, toDate]);

  const handleRowClick = (ticketId) => {
    navigate(`/support-tickets/${ticketId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <MainLayout title="Support Tickets">
      <Container fluid className="py-4">
        <Row className="g-4">
          <Col xs={12} md={3} lg={2}>
            <Card className="shadow-sm mt-5 border-0">
              <Card.Header className="bg-white text-dark py-3 text-center">
                <h5 className="mb-0">Filter Options</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Select by Role:</h6>
                  {ROLES.map((Role) => {
                    return (
                      <Button
                        key={Role}
                        variant={Role === selectedRole ? "primary" : "light"}
                        className="d-flex w-100 mb-2 justify-content-between align-items-center"
                        onClick={() => setSelectedRole(Role)}
                      >
                        {Role}
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <h6 className="text-muted mb-2">Filter by Tickets:</h6>
                  {FILTERS.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={
                        filter.name === selectedFilter ? "primary" : "light"
                      }
                      className="d-flex w-100 mb-2 justify-content-between align-items-center"
                      onClick={() => setSelectedFilter(filter.name)}
                    >
                      <div className="d-flex gap-2 align-items-center">
                        {filter.icon}
                        {filter.name}
                      </div>

                      {tickets.data?.counts?.[filter.apiKey] > 0 && (
                        <div>
                          <span className="badge bg-primary rounded-pill text-white">
                            {tickets.data.counts[filter.apiKey]}
                          </span>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="mt-4">
                  {/* <Form.Label>From:</Form.Label> */}
                  <Form.Control
                    type="date"
                    className="mb-3"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  {/* <Form.Label className="mt-2">To:</Form.Label> */}
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={9} lg={10}>
            <Card className="shadow-sm border-0 mt-5">
              <Card.Header className="bg-white p-3">
                <Row className="g-2 align-items-center">
                  <Col xs={12} md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Search by Ticket ID or User Info..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                </Row>
              </Card.Header>

              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                    <p className="mt-2">Loading tickets...</p>
                  </div>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <Table
                    hover
                    responsive
                    className="mb-0 no-bottom-border-table table-borderless"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User Info</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log(tickets)}
                      {tickets?.data?.tickets?.length > 0 ? (
                        tickets.data.tickets.map((ticket) => (
                          <tr
                            key={ticket.ticketId}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(ticket.ticketId)}
                          >
                            <td>{ticket.ticketId}</td>
                            <td>{ticket.userId}</td>
                            <td>{ticket?.category}</td>
                            <td>
                              {formatDate(ticket.createdAt)}
                            </td>
                            <td>
                              <span
                                className={`bg-opacity-10 px-3 py-2 w-75 d-inline-flex align-items-center justify-content-center gap-2 fw-bold rounded-pill ${ticket.status === "open"
                                  ? "bg-success text-success"
                                  : "bg-danger text-danger"
                                  }`}
                              >
                                {ticket.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            {/* No tickets found. */}

                            <div className="text-center py-5">
                              <div className="mb-3">
                                <IoTicketOutline size={48} className="text-muted" />
                              </div>
                              <h5 className="text-muted">No tickets found</h5>
                              <p className="text-muted mb-0">
                                {searchTerm
                                  ? `No tickets match "${searchTerm}". Try adjusting your search.`
                                  : 'Get started by adding your first tickets.'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}

                {tickets?.data?.tickets?.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="small text-muted">
                      Showing{" "}
                      {totalTickets > 0 ? (currentPage - 1) * limit + 1 : 0} to{" "}
                      {Math.min(currentPage * limit, totalTickets)} of{" "}
                      {totalTickets} entries
                    </div>
                    <Pagination className="mb-0">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}

export default SupportTicket;
