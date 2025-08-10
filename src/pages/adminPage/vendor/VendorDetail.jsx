import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import MainLayout from '../../../components/layout/MainLayout';
import NetwordCards from '../../../components/dashboard/NetworkCards';
import useAuth from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { toastAlert } from '../../../utils/toast';
import AdminVendorTransaction from '../../adminPage/AdminVendorTransaction';
import Loader from '../../../components/common/Loader';
import { IoIosArrowBack } from 'react-icons/io';

const VendorDetail = () => {
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);
    const [networkStats, setNetworkStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { fetchVendorByIdDetails } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState("success");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        employeeIds: [],
        fromDate: '',
        toDate: '',
    });

    useEffect(() => {
        if (!id) return;

        const fetchVendor = async () => {
            const data = {
                tab: selectedTab === 'success' ? 1 : 0,
                vendorId: [id],
                page: currentPage,
                limit: itemsPerPage,
                ...filters,
            };
            try {
                setLoading(true);
                const response = await fetchVendorByIdDetails(data);

                if (response.success) {
                    const data = response.data;
                    const vendorData = data?.vendors?.[0] || null;

                    setVendor(vendorData);
                    setNetworkStats(data.network || {});
                    setTransactions(data?.recentTransactions || []);
                } else {
                    toastAlert("error", "Vendor not found");
                }
            } catch (error) {
                toastAlert("error", "Failed to load vendor data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [id, filters, currentPage, itemsPerPage, selectedTab]);

    if (loading) {
        return (
            <MainLayout title="Vendor Details">
                <Loader text="Loading vendor details..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Vendor Details">
            <div className='p-3'>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <IoIosArrowBack size={30} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                    <h3 className="mb-0 fw-semibold">Vendor Transaction List</h3>
                </div>

                {/* ✅ Vendor Info */}
                {vendor && (
                    <Row className="mb-4">
                        <Col md={12} lg={6}>
                            <div className="d-flex align-items-center p-3 bg-white rounded-4 shadow border">
                                <img
                                    src={vendor.profile}
                                    alt={vendor.username}
                                    width="72"
                                    height="72"
                                    className="rounded-circle me-3 border"
                                    style={{ objectFit: "cover" }}
                                />
                                <div>
                                    <h5 className="fw-bold mb-1">{vendor.username}  ({vendor?.unique_id})</h5>
                                    <div className="text-muted small mb-1">{vendor.email}</div>
                                    <div className="text-muted small">{vendor.phone}</div>
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
                        <AdminVendorTransaction
                            loading={loading}
                            transactions={transactions || []}
                            total={transactions?.total || 0}
                            filters={filters}
                            setFilters={setFilters}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            adminsidevendordetail={true}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default VendorDetail;
