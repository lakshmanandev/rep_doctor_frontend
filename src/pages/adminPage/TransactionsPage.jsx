import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { FaSearch, FaFilter, FaCalendarAlt, FaDownload } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";

// Sample transaction data - in a real app this would come from an API
const sampleTransactions = [
  {
    id: "TX-12345",
    rideType: "Car Ride",
    cardType: "Visa",
    cardNumber: "****4321",
    paymentType: "Credit Card",
    amount: 24.99,
    date: "May 8, 2025",
    status: "Completed"
  },
  {
    id: "TX-12346",
    rideType: "Bike Ride",
    cardType: "Mastercard",
    cardNumber: "****8765",
    paymentType: "Credit Card",
    amount: 12.50,
    date: "May 8, 2025",
    status: "Completed"
  },
  {
    id: "TX-12347",
    rideType: "Scooter Ride",
    cardType: "Apple Pay",
    cardNumber: "",
    paymentType: "Digital Wallet",
    amount: 8.75,
    date: "May 7, 2025",
    status: "Pending"
  },
  {
    id: "TX-12348",
    rideType: "Car Ride",
    cardType: "PayPal",
    cardNumber: "",
    paymentType: "Digital Payment",
    amount: 35.25,
    date: "May 7, 2025",
    status: "Completed"
  },
  {
    id: "TX-12349",
    rideType: "Car Ride",
    cardType: "Amex",
    cardNumber: "****7890",
    paymentType: "Credit Card",
    amount: 42.75,
    date: "May 6, 2025",
    status: "Failed"
  },
  {
    id: "TX-12350",
    rideType: "Bike Ride",
    cardType: "Google Pay",
    cardNumber: "",
    paymentType: "Digital Wallet",
    amount: 15.20,
    date: "May 6, 2025",
    status: "Completed"
  },
  {
    id: "TX-12351",
    rideType: "Car Ride",
    cardType: "Mastercard",
    cardNumber: "****2468",
    paymentType: "Credit Card",
    amount: 28.50,
    date: "May 5, 2025",
    status: "Completed"
  },
  {
    id: "TX-12352",
    rideType: "Scooter Ride",
    cardType: "Visa",
    cardNumber: "****1357",
    paymentType: "Credit Card",
    amount: 9.99,
    date: "May 5, 2025",
    status: "Completed"
  },
  {
    id: "TX-12353",
    rideType: "Car Ride",
    cardType: "Venmo",
    cardNumber: "",
    paymentType: "Digital Payment",
    amount: 32.00,
    date: "May 4, 2025",
    status: "Pending"
  },
  {
    id: "TX-12354",
    rideType: "Bike Ride",
    cardType: "Discover",
    cardNumber: "****9876",
    paymentType: "Credit Card",
    amount: 14.75,
    date: "May 4, 2025",
    status: "Completed"
  },
  {
    id: "TX-12355",
    rideType: "Car Ride",
    cardType: "Visa",
    cardNumber: "****5432",
    paymentType: "Credit Card",
    amount: 45.50,
    date: "May 3, 2025",
    status: "Completed"
  },
  {
    id: "TX-12356",
    rideType: "Scooter Ride",
    cardType: "Apple Pay",
    cardNumber: "",
    paymentType: "Digital Wallet",
    amount: 11.25,
    date: "May 3, 2025",
    status: "Failed"
  }
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Initialize transactions on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setTransactions(sampleTransactions);
  }, []);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.rideType.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "All" ||
      transaction.status === statusFilter;

    // Date filter logic would go here in a real implementation

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const headers = [
      "Transaction ID",
      "Ride Type",
      "Card Type",
      "Card Number",
      "Payment Type",
      "Amount",
      "Date",
      "Status"
    ];

    const csvRows = [
      headers.join(","),
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.rideType,
        tx.cardType,
        tx.cardNumber,
        tx.paymentType,
        tx.amount,
        tx.date,
        tx.status
      ].map(value => `"${value}"`).join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <MainLayout title="Transactions">
      <Container fluid className="px-4 py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-1">Transactions</h2>
            <p className="text-muted mb-0">View and manage all transaction records</p>
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center"
              onClick={handleExport}
            >
              <FaDownload className="me-2" /> Export
            </Button>
          </Col>
        </Row>

        {/* Filters Row */}
        <Row className="mb-4 g-3">
          <Col xs={12} md={4} lg={5}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search transactions by ID or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <InputGroup>
              <InputGroup.Text className="bg-white">
                <FaCalendarAlt className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="date"
                placeholder="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Form.Control
                type="date"
                placeholder="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </InputGroup>
          </Col>

          <Col xs={12} md={4} lg={4} className="d-flex gap-2">
            <Dropdown className="flex-grow-1">
              <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                <span><FaFilter className="me-2" /> Status: {statusFilter}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item active={statusFilter === "All"} onClick={() => setStatusFilter("All")}>
                  All
                </Dropdown.Item>
                <Dropdown.Item active={statusFilter === "Completed"} onClick={() => setStatusFilter("Completed")}>
                  Completed
                </Dropdown.Item>
                <Dropdown.Item active={statusFilter === "Pending"} onClick={() => setStatusFilter("Pending")}>
                  Pending
                </Dropdown.Item>
                <Dropdown.Item active={statusFilter === "Failed"} onClick={() => setStatusFilter("Failed")}>
                  Failed
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="primary" onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setDateRange({ start: "", end: "" });
            }}>
              Reset
            </Button>
          </Col>
        </Row>

        {/* Transactions Table */}
        <Row>
          <Col>
            {/* <TransactionList transactions={filteredTransactions} isDashboard={false} /> */}
          </Col>
        </Row>
      </Container>
    </MainLayout >
  );
};

export default TransactionsPage;