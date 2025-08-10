import React, { useEffect, useState, useCallback } from "react";
import { Button, Badge, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "react-data-table-component";
import { FaSync } from "react-icons/fa";
import { formatDateTime } from "../../utils/formatters";
import { IoIosArrowBack } from "react-icons/io";
import log from "../../utils/logger";

const networkExplorerMap = {
    bsc: {
        tx: "https://bscscan.com/tx/",
        address: "https://bscscan.com/address/",
    },
    eth: {
        tx: "https://etherscan.io/tx/",
        address: "https://etherscan.io/address/",
    },
    polygon: {
        tx: "https://polygonscan.com/tx/",
        address: "https://polygonscan.com/address/",
    },
    tron: {
        tx: "https://tronscan.org/#/transaction/",
        address: "https://tronscan.org/#/address/",
    },
    BEP20: {
        tx: "https://bscscan.com/tx/",
        address: "https://bscscan.com/address/",
    },
    ERC20: {
        tx: "https://etherscan.io/tx/",
        address: "https://etherscan.io/address/",
    },
    POLYGON: {
        tx: "https://polygonscan.com/tx/",
        address: "https://polygonscan.com/address/",
    },
    TRON: {
        tx: "https://tronscan.org/#/transaction/",
        address: "https://tronscan.org/#/address/",
    },
    TRC20: {
        tx: "https://tronscan.org/#/transaction/",
        address: "https://tronscan.org/#/address/",
    },
};


const AdminDashboardTransactionDetailPage = () => {
    const { transactionId } = useParams();
    const { fetchTransactionDetailsbyAdmin, fetchGetBalancebyAdmin } = useAuth();
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchDetails = useCallback(async () => {
        const data = {
            txn_id: transactionId,
            page: currentPage,
            limit: itemsPerPage,
        };
        try {
            setLoading(true);
            const response = await fetchTransactionDetailsbyAdmin(data);
            if (response.success) {
                log("response", response.data)
                setTransactionDetails(response.data || []);
                setTotalItems(response.data.pagination.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch details:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchTransactionDetailsbyAdmin, transactionId, currentPage, itemsPerPage]);


    useEffect(() => {
        fetchDetails();
    }, [currentPage, itemsPerPage]);


    const handleRefresh = useCallback(async () => {
        const txn = transactionDetails?.transaction?.[0];
        if (!txn?.wallet?.address) return;

        const data = {
            address: txn.wallet.address,
            network: txn.network,
            token: txn.wallet.token,
            showHistory: true,
        };
        setIsRefreshing(true);
        try {
            const response = await fetchGetBalancebyAdmin(data);
            if (response.success) {
                fetchDetails();
            }
        } catch (error) {
            console.error("Failed to fetch details:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [transactionDetails, fetchGetBalancebyAdmin, fetchDetails]);


    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "60px"
        },
        {
            name: "Txn Hash",
            selector: (row) =>
                row.hash ? (
                    <a
                        href={`${networkExplorerMap[row?.wallet?.network]?.tx || '#'}${row.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {row.hash}
                    </a>
                ) : "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Wallet Address",
            selector: (row) =>
                row.wallet?.address ? (
                    <a
                        href={`${networkExplorerMap[row?.wallet?.network]?.address || '#'}${row.wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {row.wallet.address}
                    </a>
                ) : "—",
            sortable: true,
            wrap: true,
        },

        {
            name: "Amount",
            selector: (row) => row.amount,
            width: '120px',
            sortable: true,
        },
        {
            name: "Network",
            selector: (row) => row.network,
            width: '150px',
            sortable: true,
        },
        {
            name: "Vendor",
            selector: (row) => row.vendor?.username,
            sortable: true,
        },
        {
            name: "Employee",
            selector: (row) => row.employee?.username,
            sortable: true,
        },
        {
            name: "Transaction Date",
            selector: (row) =>
                row.transactionDate
                    ? formatDateTime(row.transactionDate)
                    : "—",
            sortable: true,
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
    ];

    const columns1 = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "60px"
        },
        {
            name: "Txn Hash",
            selector: (row) =>
                row.hash ? (
                    <a
                        href={`${networkExplorerMap[row?.network]?.tx || '#'}${row.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {row.hash}
                    </a>
                ) : "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Wallet Address",
            selector: (row) =>
                row.wallet_address ? (
                    <a
                        href={`${networkExplorerMap[row?.network]?.address || '#'}${row.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {row.wallet_address}
                    </a>
                ) : "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            width: '120px',
            sortable: true,
        },
        {
            name: "Network",
            selector: (row) => row.network,
            width: '150px',
            sortable: true,
        },
        {
            name: "Sender",
            selector: (row) => row.sender,
            sortable: true,
        },
        {
            name: "Receiver",
            selector: (row) => row.receiver,
            sortable: true,
        },
        {
            name: "Transaction Date",
            selector: (row) =>
                row.transactionDate
                    ? formatDateTime(row.transactionDate)
                    : "—",
            sortable: true,
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
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
    ];

    return (
        <MainLayout title="Transaction Detail">
            <Row className="mb-3 mt-3 align-items-center">
                {/* Back + Title */}
                <Col xs={12} md={8} className="mb-2 mb-md-0">
                    <div className="d-flex align-items-center gap-2">
                        <IoIosArrowBack
                            size={30}
                            onClick={() => navigate(-1)}
                            style={{ cursor: 'pointer' }}
                        />
                        <h5 className="mb-0 fw-semibold text-break">
                            Transaction ID: <Badge bg="secondary">{transactionId}</Badge>
                        </h5>
                    </div>
                </Col>

                {/* Refresh Button */}
                {/* {transactionDetails?.transaction?.some(txn => txn.status === 0) && (
                    <Col xs={12} md={4} className="text-md-end text-start">
                        <Button
                            variant="outline-primary"
                            onClick={handleRefresh}
                            className=" w-md-auto"
                        >
                            <FaSync className="me-1" /> Refresh
                        </Button>
                    </Col>
                )} */}


                {transactionDetails?.transaction?.some(txn => txn.status === 0) && (
                    <Col xs={12} md={4} className="text-md-end text-start">
                        <Button
                            variant="outline-primary"
                            onClick={handleRefresh}
                            className="w-md-auto"
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-1"
                                        style={{ width: "1rem", height: "1rem" }}
                                    />
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    <FaSync className="me-1" /> Refresh
                                </>
                            )}
                        </Button>
                    </Col>
                )}
            </Row>


            <Card className="h-100 shadow rounded-5 border border-0">
                <Card.Body>
                    <div style={{ overflowX: 'auto' }}>
                        <DataTable
                            title="Transaction Details"
                            columns={columns}
                            data={transactionDetails.transaction}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalItems}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
                            paginationPerPage={itemsPerPage}
                            responsive
                            persistTableHead
                            highlightOnHover
                            noDataComponent="No transaction records found."
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


                    {
                        transactionDetails?.adminTxn?.length !== 0 &&
                        <div style={{ overflowX: 'auto' }}>
                            <DataTable
                                title="Admin Transaction Details"
                                columns={columns1}
                                data={transactionDetails.adminTxn}
                                progressPending={loading}
                                responsive
                                persistTableHead
                                highlightOnHover
                                noDataComponent="No transaction records found."
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
                    }


                </Card.Body>
            </Card>
        </MainLayout>
    );
};

export default AdminDashboardTransactionDetailPage;
