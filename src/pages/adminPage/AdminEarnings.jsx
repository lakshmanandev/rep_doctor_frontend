import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import useAuth from '../../hooks/useAuth';
import PageLoader from '../../components/common/PageLoader';
import EarningsChart from '../../components/common/EarningsChart';
import NetwordCards from '../../components/dashboard/NetworkCards';
import CustomTransactionLoader from '../../components/common/Loader';
import FilterBar from '../../components/common/FilterBar';
import { Button, Card, Container, Dropdown } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Eye } from 'react-feather';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const AdminEarnings = () => {
    const { getAdminEarnings, getAdminSendGasfeesEarnings, getAdminBalance } = useAuth();
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);      // Full page loader
    const [tableLoading, setTableLoading] = useState(false);   // Table-only loader
    const [gasLoading, setGasLoading] = useState(true);
    const [adminbalLoading, setAdminbalLoading] = useState(true);
    const [adminBalance, setAdminBalance] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [error, setError] = useState(null);
    const [adminGasEarnings, setAdminGasEarnings] = useState([]);
    const [gascurrentPage, setGasCurrentPage] = useState(1);
    const [gasitemsPerPage, setGasItemsPerPage] = useState(10);
    const [gastotalItems, setGasTotalItems] = useState(0);


    const [filters, setFilters] = useState({
        vendorIds: [],
        fromDate: '',
        toDate: '',
    });

    const [filters1, setFilters1] = useState({
        vendorIds: [],
        fromDate: '',
        toDate: '',
    });

    const statusMap = {
        2: { label: 'Inactive', color: 'inactive', bgColor: '#ffe4de' },
        1: { label: 'Active', color: 'active', bgColor: '#dbf6e5' },
    };

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                fontSize: '17px', // Increase size
                paddingLeft: '16px',
                paddingRight: '16px',
                textTransform: 'capitalize', // optional
            },
        },
        rows: {
            style: {
                minHeight: '64px', // row height
                paddingTop: '10px',
                paddingBottom: '10px',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
    };


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const columns = [
        {
            name: 'Name',
            selector: row => row.username,
            sortable: true,
            cell: row => (
                <div className="d-flex align-items-center">
                    <img src={row.profile} alt={row.username} width="36" height="36" className="rounded-circle me-2" />
                    <div>
                        <div className="fw-medium">{row.username}</div>
                        <div className="text-muted small">{row.email}</div>
                    </div>
                </div>
            ),
        },
        {
            name: 'VendorId',
            selector: row => row.unique_id,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'SendAmount',
            selector: row => formatCurrency(row.senderAmount),
        },
        {
            name: 'ReceivedAmount',
            selector: row => formatCurrency(row.receiverAmount),
        },
        {
            name: 'Status',
            selector: row => row.user_status,
            cell: row => (
                <span className={`badge ${statusMap[row.user_status].color}`}>
                    {statusMap[row.user_status].label}
                </span>
            ),
        },

        {
            name: 'Action',
            cell: row => (
                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent">
                        <FiMoreHorizontal size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/vendors/${row.encrypted_id}`)}>
                            <Eye size={14} className="me-2" /> View
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        },
    ];

    const columns1 = [
        {
            name: 'Name',
            selector: row => row.username,
            sortable: true,
            cell: row => (
                <div className="d-flex align-items-center">
                    <img src={row.profile} alt={row.username} width="36" height="36" className="rounded-circle me-2" />
                    <div>
                        <div className="fw-medium">{row.username}</div>
                        <div className="text-muted small">{row.email}</div>
                    </div>
                </div>
            ),
        },
        {
            name: 'VendorId',
            selector: row => row.unique_id,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'SendAmount',
            selector: row => formatCurrency(row.gasAmount),
        },
        {
            name: 'Status',
            selector: row => row.user_status,
            cell: row => (
                <span className={`badge ${statusMap[row.user_status].color}`}>
                    {statusMap[row.user_status].label}
                </span>
            ),
        },

        {
            name: 'Action',
            cell: row => (
                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent">
                        <FiMoreHorizontal size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/vendors/${row.encrypted_id}`)}>
                            <Eye size={14} className="me-2" /> View
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
        },
    ];


    const handleFilterChange = (updatedFilters) => {
        const isSame =
            JSON.stringify(updatedFilters) === JSON.stringify(filters);

        if (!isSame) {
            setFilters(updatedFilters);
            setCurrentPage(1);
        }
    };

    const handleFilterChange1 = (updatedFilters) => {
        const isSame =
            JSON.stringify(updatedFilters) === JSON.stringify(filters1);

        if (!isSame) {
            setFilters1(updatedFilters);
            setGasCurrentPage(1);
        }
    };


    const fetchEarnings = async (isInitial = false) => {
        const data = {
            page: currentPage,
            limit: itemsPerPage,
            ...filters,
        };

        try {
            isInitial ? setPageLoading(true) : setTableLoading(true);

            const response = await getAdminEarnings(data);

            if (response.success && response.data) {
                setDashboardData(response.data);
                setTotalItems(response.data.pagination?.total || 0);
            } else {
                // Reset to empty if no data
                setDashboardData({ vendors: [], pagination: { total: 0 } });
                setTotalItems(0);
            }
        } catch (err) {
            // Also clear data on failure
            setDashboardData({ vendors: [], pagination: { total: 0 } });
            setTotalItems(0);
            setError(err.message);
        } finally {
            isInitial ? setPageLoading(false) : setTableLoading(false);
        }
    };


    useEffect(() => {
        fetchEarnings(false);
    }, [filters, currentPage, itemsPerPage]);


    useEffect(() => {
        fetchEarnings(true);
    }, []);

    const getAdminEarningsGasLists = async () => {
        const data = {
            page: gascurrentPage,
            limit: gasitemsPerPage,
            ...filters1,
        };
        try {
            setGasLoading(true)
            const response = await getAdminSendGasfeesEarnings(data);
            if (response.success) {
                setAdminGasEarnings(response.data);
                setGasTotalItems(response.data.gasfee_pagination.total || 0);
                setGasLoading(false)
            } else {
                // Clear the table data if no results
                setAdminGasEarnings({ vendorsGasfee: [], gasfee_balanceinfo: [] });
                setGasTotalItems(0);
            }
        } catch (err) {
            setAdminGasEarnings({
                vendorsGasfee: [],
                gasfee_balanceinfo: [],
                ...(response.data || {})
            });

            setGasTotalItems(0);
            setError(err.message);
        } finally {
            setGasLoading(false);
        }
    };


    useEffect(() => {
        getAdminEarningsGasLists();
    }, [filters1, gasitemsPerPage, gascurrentPage])


    useEffect(() => {
        fetchAdminBalance();
    }, [])

    const fetchAdminBalance = async () => {
        try {
            setAdminbalLoading(true)
            const response = await getAdminBalance();
            if (response.success) {
                setAdminBalance(response?.data?.Nativebalances);
                setAdminbalLoading(false)
            } else {
                setAdminBalance([]);
            }
        } catch (err) {
            setAdminBalance([]);
            setError(err.message);
        } finally {
            setAdminbalLoading(false);
        }
    }

    const exportToExcel = (data, columns, filename = 'export.xlsx') => {
        const mappedData = data.map(row => {
            const rowData = {};
            columns.forEach(col => {
                const key = typeof col.selector === 'function'
                    ? col.selector(row)
                    : row[col.selector];
                rowData[col.name] = key;
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, filename);
    };

    return (

        <MainLayout title="Earnings">
            {pageLoading ? (
                <PageLoader />
            ) : (
                <>
                    <Container fluid className="p-3">

                        <div className="row g-4 mb-3">
                            <div className="col">
                                <div className="card p-3 shadow-sm">
                                    <EarningsChart />
                                </div>
                            </div>
                        </div>

                        {adminBalance?.length != 0 && (
                            <>
                                <h3 className="h3 fw-semibold">Admin Main Balance Info</h3>

                                <NetwordCards data={adminBalance} gasfees={true} />
                            </>
                        )
                        }



                        <h3 className="h3 mt-5 fw-semibold">Admin Deposit Address USDT Balance</h3>

                        <NetwordCards data={dashboardData?.balanceinfo} />


                        <h3 className="h3 mt-5 fw-semibold">Total Recived Token Info</h3>
                        <NetwordCards data={dashboardData?.network} />

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <h3 className="card-title fw-bold">Total Recived Token Transactions List</h3>
                            <Button variant="outline-primary" onClick={() => exportToExcel(dashboardData?.vendors || [], columns, 'Admin_Received_Tokens.xlsx')}>
                                <FaDownload className="me-2" />
                                Export
                            </Button>
                        </div>
                        <Card className="p-3 border-0 shadow rounded-4 mt-3">

                            <Card.Header className="bg-white border-0 mb-2">
                                <FilterBar showVendor={true} showEmployee={false} onFilterChange={handleFilterChange} />
                            </Card.Header>

                            <div style={{ overflowX: 'auto' }}>
                                <DataTable
                                    columns={columns}
                                    data={dashboardData?.vendors}
                                    customStyles={customStyles}
                                    progressPending={tableLoading}
                                    progressComponent={<CustomTransactionLoader text='Loading Vendor' />}
                                    pagination
                                    paginationServer // <<< Enables server-side pagination
                                    paginationTotalRows={totalItems} // from backend
                                    onChangePage={(page) => setCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage) => setItemsPerPage(newPerPage)}
                                    paginationPerPage={itemsPerPage}
                                    highlightOnHover
                                    pointerOnHover
                                    responsive
                                    noDataComponent="No vendors found matching your criteria."
                                // dense
                                />
                            </div>
                        </Card>

                        <h3 className="h3 mt-5 fw-semibold">Total Send Gas Fees Info</h3>

                        <NetwordCards data={adminGasEarnings?.gasfee_balanceinfo} gasfees={true} />

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <h3 className="card-title fw-bold">Total Send Gas Fees Transactions List</h3>
                            <Button variant="outline-primary" onClick={() => exportToExcel(adminGasEarnings?.vendorsGasfee || [], columns1, 'Admin_Gas_Fees.xlsx')} >
                                <FaDownload className="me-2" />
                                Export
                            </Button>
                        </div>
                        <Card className="p-3 border-0 shadow rounded-4 mt-3">
                            <Card.Header className="bg-white border-0 mb-2">
                                <FilterBar showVendor={true} showEmployee={false} onFilterChange={handleFilterChange1} />
                            </Card.Header>

                            <div style={{ overflowX: 'auto' }}>
                                <DataTable
                                    columns={columns1}
                                    data={adminGasEarnings?.vendorsGasfee}
                                    customStyles={customStyles}
                                    progressPending={gasLoading}
                                    progressComponent={<CustomTransactionLoader />}
                                    pagination
                                    paginationServer // <<< Enables server-side pagination
                                    paginationTotalRows={gastotalItems} // from backend
                                    onChangePage={(page) => setGasCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage) => setGasItemsPerPage(newPerPage)}
                                    paginationPerPage={gasitemsPerPage}
                                    highlightOnHover
                                    pointerOnHover
                                    responsive
                                    noDataComponent="No Transactions."
                                // dense
                                />
                            </div>
                        </Card>
                    </Container>
                </>)
            }
        </MainLayout >
    );
};

export default AdminEarnings;
