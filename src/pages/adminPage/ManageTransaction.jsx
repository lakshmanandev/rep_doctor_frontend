
import React, { useCallback, useEffect, useState } from "react";
import { formatCurrency, getCurrentDateTime } from "../../utils/formatters";
import "./transaction_list.css";
import DataTable from 'react-data-table-component';
import {
  Badge, Dropdown, Card, Row, Col,
  Button, Nav, Modal, Form,
  Container
} from 'react-bootstrap';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Eye } from 'react-feather';
import { toastAlert } from "../../utils/toast";
import useAuth from "../../hooks/useAuth";
import FilterBar from "../../components/common/FilterBar";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
import CustomTransactionLoader from "../../components/common/Loader";
import PageLoader from "../../components/common/PageLoader";
import { FaDownload } from "react-icons/fa";



const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [status, setStatus] = useState(1);
  const [date, setDate] = useState(getCurrentDateTime());
  const [selectedTab, setSelectedTab] = useState("unpaid");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);      // Full page loader
  const [tableLoading, setTableLoading] = useState(false);   // Table-only loader


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    vendorIds: [],
    fromDate: '',
    toDate: '',
  });

  const { fetchManageTransactionbyAdmin } = useAuth(); // Dummy for now

  const fetchData = useCallback(async (isInitial = false) => {
    const data = {
      tab: selectedTab === "unpaid" ? 0 : 1,
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
    };
    try {
      isInitial ? setPageLoading(true) : setTableLoading(true);

      const response = await fetchManageTransactionbyAdmin(data);
      if (response.success) {
        setTransactions(response.data);
      }

    } catch (error) {
      toastAlert("error", "Failed to fetch config");
      console.error(error);
    } finally {
      isInitial ? setPageLoading(false) : setTableLoading(false);
    }
  }, [fetchManageTransactionbyAdmin]);

  useEffect(() => {
    fetchData(false);
  }, [filters, currentPage, itemsPerPage, selectedTab]);

  useEffect(() => {
    fetchData(true);
  }, []);

  const handleFilterChange = (updatedFilters) => {
    const isSame =
      JSON.stringify(updatedFilters) === JSON.stringify(filters);

    if (!isSame) {
      setFilters(updatedFilters);
      setCurrentPage(1);
    }
  };

  const statusBadgeMap = {
    0: { color: "danger", label: "Unpaid" },
    1: { color: "success", label: "Paid" },
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toastAlert("error","No transactions to export.");
      return;
    }

    const headers = [
      "Transaction ID", "Amount", "Date", "Status"
    ];

    const csvRows = [
      headers.join(","),
      ...transactions.map(tx => [
        tx.id, tx.amount, tx.date, tx.status
      ].map(value => `"${value}"`).join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  const handleSave = async () => {
    if (!selectedVendorId) return;

    const payload = {
      tab: selectedTab === "unpaid" ? 0 : 1,
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
      vendor_updated_status: [
        {
          vendorId: selectedVendorId,
          admin_paid_status: Number(status),
          date,
        },
      ],
    };

    try {
      const res = await fetchManageTransactionbyAdmin(payload);

      if (!res?.success) {
        toastAlert("error", res?.message || "Update failed");
        return;
      }

      toastAlert("success", "Transaction updated");
      setTransactions(res.data);
      setShowModal(false);
    } catch (err) {
      toastAlert("error", "Server error");
    }
  };


  const columns = [
    {
      name: 'Vendor Info',
      cell: row => (
        row?.profile || row?.username || row?.email ? (
          <div className="d-flex align-items-center">
            <img src={row?.profile || null} alt={row.username || "Vendor"} width="36" height="36" className="rounded-circle me-2" />
            <div>
              <div className="fw-medium">{row?.username}</div>
              <div className="text-muted small">{row?.email}</div>
            </div>
          </div>
        ) : (
          <span className="text-muted small">No Vendor Info</span>
        )
      ),
    },
    {
      name: 'Receive Amount',
      selector: row => row.receivedAmount,
      sortable: true,
      cell: row => (
        <div className="text-end">
          <div className="fw-medium">{formatCurrency(row.receivedAmount)}</div>
          <div className="text-muted small">{row.date}</div>
        </div>
      ),
    },
    {
      name: 'Send Amount',
      selector: row => row.SendAmount,
      sortable: true,
      cell: row => (
        <div className="text-end">
          <div className="fw-medium">{formatCurrency(row.SendAmount)}</div>
          <div className="text-muted small">{row.date}</div>
        </div>
      ),
    },
    {
      name: 'From Date',
      selector: row => row.fromDate,
      cell: row => <div className="text-end fw-medium">{row.fromDate}</div>,
    },
    {
      name: 'To Date',
      selector: row => row.toDate,
      cell: row => <div className="text-end fw-medium">{row.toDate}</div>,
    },
    {
      name: 'Status',
      selector: row => row.adminPaidStatus,
      cell: row => {
        const badge = statusBadgeMap[row.adminPaidStatus] || { color: "secondary", label: row.adminPaidStatus };
        return (
          <Badge bg={badge.color} className={`bg-opacity-10 text-${badge.color} rounded-pill px-3 py-1`}>
            ● {badge.label}
          </Badge>
        );
      },
    },
    {
      name: 'Action',
      cell: row => (
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent">
            <FiMoreHorizontal size={16} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {
              setSelectedTransaction(row);
              if (row.adminPaidStatus === 1) {
                setShowModal1(true); // Paid modal
              } else {
                setSelectedVendorId(row?.encryptedVendorId);
                setShowModal(true); // Unpaid modal
              }
            }}>
              <Eye size={14} className="me-2" /> View Details
            </Dropdown.Item>


          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <MainLayout title="Transactions">
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
          <Container fluid className="px-4 py-4">
            <Card className="h-100 shadow rounded-5 border border-0">
              <Card.Body className="p-4">
                <Row className="mb-4 w-100 align-items-center justify-content-between">
                  <Col>
                    <h2 className="mb-1">Transactions</h2>
                    <p className="text-muted mb-0">View and manage all transaction records</p>
                  </Col>
                  <Col xs="auto">
                <Button variant="outline-primary" onClick={handleExport}>
                  <FaDownload className="me-2" /> Export
                </Button>
              </Col>
                </Row>

                <Nav variant="tabs" activeKey={selectedTab} onSelect={setSelectedTab} className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="unpaid">Unpaid</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="paid">Paid</Nav.Link>
                  </Nav.Item>
                </Nav>

                <FilterBar
                  showEmployee={false}
                  showVendor={true}
                  onFilterChange={handleFilterChange}
                />
                <div style={{ overflowX: 'auto' }}>
                  <DataTable
                    columns={columns}
                    data={transactions}
                    progressPending={tableLoading}
                    progressComponent={<CustomTransactionLoader />}
                    pagination
                    paginationServer
                    paginationTotalRows={transactions.total}
                    onChangePage={page => setCurrentPage(page)}
                    onChangeRowsPerPage={newPerPage => setItemsPerPage(newPerPage)}
                    paginationPerPage={itemsPerPage}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noDataComponent="No transactions found."
                    customStyles={{
                      rows: { style: { minHeight: '72px' } },
                      headCells: {
                        style: {
                          fontWeight: '600',
                          fontSize: '14px',
                          backgroundColor: '#f9fafb',
                        },
                      },
                    }}
                  />
                  </div>
              </Card.Body>
            </Card>
          </Container>

          {/*unPaid Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Transaction Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value={1}>Paid</option>
                    <option value={2}>Unpaid</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>

                {/* <Link to='/admin/manage-transaction/detail/8d209f2109da1f800b68b26894d8fe68%7CZRLMgnubC_ntozjitWaLAA' className="mt-3 d-flex justify-content-center" >View Transaction</Link> */}
                <Link
                  to={`/admin/vendors/${selectedTransaction?.encryptedVendorId || ''}`}
                  className="mt-3 d-flex justify-content-center text-decoration-underline"
                >
                  View Transaction
                </Link>
              </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Update Transaction</Button>
            </Modal.Footer>
          </Modal>

          {/* paid model  */}
          <Modal show={showModal1} onHide={() => setShowModal1(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Transaction Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedTransaction && (
                <>
                  <p><strong>Status:</strong> {selectedTransaction.adminPaidStatus === 1 ? 'Paid' : 'Unpaid'}</p>
                  <p><strong>Date:</strong> {selectedTransaction.adminPaidStatus_at || '-'}</p>
                  <Link
                    to={`/admin/vendors/${selectedTransaction?.encryptedVendorId || ''}`}
                    className="mt-3 d-flex justify-content-center text-decoration-underline"
                  >
                    View Transaction
                  </Link>
                </>
              )}
            </Modal.Body>
          </Modal>
        </>)}

    </MainLayout>

  );
};

export default TransactionList;
