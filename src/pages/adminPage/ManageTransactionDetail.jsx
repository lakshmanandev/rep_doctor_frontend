import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import NetwordCards from '../../components/dashboard/NetworkCards';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { toastAlert } from '../../utils/toast';
import AdminVendorTransaction from '../adminPage/AdminVendorTransaction';
import Loader from '../../components/common/Loader';
import MainLayout from '../../components/layout/MainLayout';

const ManageTransactionDetail = () => {
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);
    const [networkStats, setNetworkStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { fetchVendorByIdDetails } = useAuth();
    const { id } = useParams();

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
    }, [id, filters, currentPage, itemsPerPage]);

    if (loading) {
        return (
            <MainLayout title="Transaction Details">
                <Loader text="Loading Transaction details..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Transaction Details">
            <div className='p-3'>

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
                        // isDashboard={true}
                        />
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default ManageTransactionDetail;
