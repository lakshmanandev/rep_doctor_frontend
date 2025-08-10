
import React from "react";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import "./transaction_list.css";
import DataTable from 'react-data-table-component';
import { Badge, Dropdown, Card, Nav, Button } from 'react-bootstrap';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Eye } from 'react-feather';
import EmployeeTransactionFilterBar from "./EmployeeTransactionFilterBar";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { toastAlert } from "../../utils/toast";

const AdminEmployeeTransaction = ({
    selectedTab,
    setSelectedTab,
    handleFilterChange,
    employeeId,
    loading,
    transactions,
    total,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    isDashboard,
    adminsideEmployeedetail,
}) => {

    const navigate = useNavigate();
    const handleViewDetails = (txnId) => {
        navigate(`/transactions/${txnId}`);
    };

    const columns = [
        {
            name: 'Address',
            selector: row => row.address,
            cell: row => (
                <div className="text-end">
                    <div className="fw-medium">{row.address}</div>
                </div>
            ),
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            cell: row => (
                <div className="text-end">
                    <div className="fw-medium">{formatCurrency(row.amount)}</div>
                </div>
            ),
        },
        {
            name: 'Date',
            selector: row => row.transactionDate,
            sortable: true,
            cell: row => (
                <div className="text-end text-muted small">
                    {formatDateTime(row.transactionDate)}
                </div>
            ),
        },
        {
            name: 'Network',
            selector: row => row.network,
            cell: row => <div className="text-end">{row.network}</div>,
        },
        {
            name: 'Transaction ID',
            selector: row => row.transactionId,
            cell: row => <div>{row.transactionId}</div>,
        },
        {
            name: 'Transaction Count',
            selector: row => row.tnx_count,
            cell: row => <div>{row.tnx_count}</div>,
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => {
                const statusMap = {
                    0: { label: 'Failed', color: 'danger' },
                    1: { label: 'Completed', color: 'success' },
                };
                const badge = statusMap[row.status] || { label: 'Unknown', color: 'secondary' };
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
                        <Dropdown.Item onClick={() => handleViewDetails(row.transactionId)}>
                            <Eye size={14} className="me-2" /> View Details
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        },
    ];

    const handleExportToExcel = () => {
        if (!transactions.length) {
            toastAlert("error", "No transactions to export");
            return;
        }

        const exportData = transactions.map(txn => ({
            'Address': txn.address || '',
            'Amount': formatCurrency(txn.amount),
            'Date': formatDateTime(txn.transactionDate),
            'Network': txn.network,
            'Transaction ID': txn.transactionId,
            'Transaction Count': txn.tnx_count,
            'Status': txn.status === 1 ? 'Completed' : 'Failed',
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Transactions');
        XLSX.writeFile(workbook, 'EmployeeTransactions.xlsx');
    };

    return (
        <>
            <Card className="h-100 shadow rounded-5 border border-0">
                <Card.Body className="p-4">
                   <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title fw-bold">Transactions</h5>
                        <Button variant="outline-primary" onClick={handleExportToExcel}>
                            <FaDownload className="me-2" />
                            Export
                        </Button>
                    </div>

                    <Nav variant="tabs" activeKey={selectedTab} onSelect={setSelectedTab} className="mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="success">Success</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="fail">Failed</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <EmployeeTransactionFilterBar
                        employeeId={employeeId}
                        adminsideEmployeedetail={adminsideEmployeedetail}
                        dashboard={isDashboard}
                        onFilterChange={handleFilterChange}
                    />
                    <div style={{ overflowX: 'auto' }}>
                        <DataTable
                            columns={columns}
                            data={transactions}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={total}
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
        </>
    );
};


export default AdminEmployeeTransaction;
