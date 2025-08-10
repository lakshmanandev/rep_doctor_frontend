import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import NetwordCards from '../../../components/dashboard/NetworkCards';
import useAuth from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { toastAlert } from '../../../utils/toast';
import AdminEmployeeTransaction from '../../adminPage/AdminEmployeeTransaction';
import MainLayout from '../../../components/layout/MainLayout';
import { IoIosArrowBack } from 'react-icons/io';
import log from '../../../utils/logger';

const EmployeeDetail = () => {
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [networkStats, setNetworkStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { getEmployeeByIdDetail } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState("success");


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        address: [],
        fromDate: '',
        toDate: '',
    });

    const handleFilterChange = (updatedFilters) => {
        const isSame =
            JSON.stringify(updatedFilters) === JSON.stringify(filters);

        if (!isSame) {
            setFilters(updatedFilters);
            setCurrentPage(1);
        }
    };


    useEffect(() => {
        if (!id) return;

        const fetchEmployee = async () => {
            const data = {
                tab: selectedTab === 'success' ? 1 : 0,
                employeeId: [id],
                page: currentPage,
                limit: itemsPerPage,
                ...filters,
            };
            try {
                setLoading(true);
                const response = await getEmployeeByIdDetail(data);
                log("response", response)

                if (response.success) {
                    const data = response.data;
                    const employeeData = data?.employees?.[0] || null;

                    setEmployee(employeeData);
                    setNetworkStats(data.network || {});
                    setTransactions(employeeData?.transactions || []);
                } else {
                    toastAlert("error", "Employee not found");
                }
            } catch (error) {
                toastAlert("error", "Failed to load employee data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id, filters, currentPage, itemsPerPage,selectedTab]);

    // if (loading) {
    //     return (
    //         <MainLayout title="Employee Details">
    //             <div className="p-5 text-center">
    //                 <Spinner animation="border" role="status" />
    //                 <div className="mt-2">Loading employee details...</div>
    //             </div>
    //         </MainLayout>
    //     );
    // }

    return (
        <MainLayout title="Employee Details">
            <div className='p-3'>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <IoIosArrowBack size={30} onClick={() => navigate('/admin/employees')} style={{ cursor: 'pointer' }} />
                    <h3 className="mb-0 fw-semibold">Employee Transaction List</h3>
                </div>

                {/* ✅ Employee Info */}
                {employee && (
                    <Row className="mb-4">
                        <Col md={12} lg={6}>
                            <div className="d-flex align-items-center p-3 bg-white rounded-4 shadow border-0">
                                <img
                                    src={employee.profile}
                                    alt={employee.username}
                                    width="72"
                                    height="72"
                                    className="rounded-circle me-3 border"
                                    style={{ objectFit: "cover" }}
                                />
                                <div>
                                    <h5 className="fw-bold mb-1">{employee.username} ({employee?.unique_id})</h5>
                                    <div className="text-muted small mb-1">{employee.email}</div>
                                    <div className="text-muted small">{employee.phone}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* ✅ Network Statistics Cards */}
                <NetwordCards data={networkStats} />

                {/* ✅ Transaction List */}
                <Row className="g-4 mt-2">
                    <Col>
                        <AdminEmployeeTransaction
                            handleFilterChange={handleFilterChange}
                            employeeId={id}
                            loading={loading}
                            transactions={transactions || []}
                            total={transactions?.total || 0}
                            filters={filters}
                            setFilters={setFilters}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            adminsideEmployeedetail={true}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default EmployeeDetail;
