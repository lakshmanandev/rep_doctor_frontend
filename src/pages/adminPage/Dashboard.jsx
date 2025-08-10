import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import MainLayout from '../../components/layout/MainLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import { dashboardService } from '../../services/dashboardService';
import NetwordCards from '../../components/dashboard/NetworkCards';
import AdminDashboardTransaction from './AdminDashboardTransaction';
import { Loader } from 'react-feather';
import PageLoader from '../../components/common/PageLoader';
// import Loader from '../../components/common/Loader';

const Dashboard = () => {
    // const [loading, setLoading] = useState(true);

    const [pageLoading, setPageLoading] = useState(true);      // Full page loader
    const [tableLoading, setTableLoading] = useState(false);   // Table-only loader

    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    const [selectedTab, setSelectedTab] = useState("success");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        vendorsId: [],
        employeeIds: [],
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

    const fetchDashboardData = async (isInitial = false) => {
        const data = {
            tab: selectedTab === 'success' ? 1 : 0,
            page: currentPage,
            limit: itemsPerPage,
            ...filters,
        };

        try {
            isInitial ? setPageLoading(true) : setTableLoading(true);

            const response = await dashboardService.getDashboardData(data);
            if (response.success) {
                setDashboardData(response.data);
            }else{
                setDashboardData(null)
            }
        } catch (err) {
            setError(err.message);
        } finally {
            isInitial ? setPageLoading(false) : setTableLoading(false);
        }
    };

    useEffect(() => {
        // fetchDashboardData(true); // first load only
    }, []);

    useEffect(() => {
        // fetchDashboardData(false); // other updates
    }, [filters, currentPage, itemsPerPage, selectedTab]);



    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <MainLayout title="Dashboard">
            {/* {pageLoading ? (
                <PageLoader />
            ) : ( */}
                <>
                    <div className='p-3'>
                        <div className="mb-4">
                            <h1 className="h3 fw-semibold">Hi, Welcome back 👋</h1>
                        </div>

                        {/* Stats Cards */}
                        <Row className="g-4 mb-4">
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="TOTAL VENDORS"
                                    value={dashboardData?.vendors?.total || 0}
                                // change={stats.totalVendorsChange}
                                // trend={stats.totalVendorsTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="ACTIVE VENDORS"
                                    value={dashboardData?.vendors?.active || 0}
                                // change={stats.activeVendorsChange}
                                // trend={stats.activeVendorsTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="INACTIVE VENDORS"
                                    value={dashboardData?.vendors?.inactive || 0}
                                // change={stats.inActiveVendorsChange}
                                // trend={stats.inActiveVendorsTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="LAST 7 DAYS VENDORS"
                                    value={dashboardData?.vendors?.last7Days || 0}
                                // change={stats.last7daysVendorsChange}
                                // trend={stats.last7daysVendorsTrend}
                                />
                            </Col>
                        </Row>

                        <Row className="g-4 mb-4">
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="TOTAL EMPLOYEES"
                                    value={dashboardData?.employees?.total || 0}
                                // change={stats.totalEmployessChange}
                                // trend={stats.totalEmployessTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="ACTIVE EMPLOYEES"
                                    value={dashboardData?.employees?.active || 0}
                                // change={stats.activeEmployeesChange}
                                // trend={stats.activeEmployeesTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="INACTIVE EMPLOYEES"
                                    value={dashboardData?.employees?.inactive || 0}
                                // change={stats.inActiveEmployeesChange}
                                // trend={stats.inActiveEmployeesTrend}
                                />
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <StatsCard
                                    title="LAST 7 DAYS EMPLOYEES"
                                    value={dashboardData?.employees?.last7Days || 0}
                                // change={stats.last7daysEmployeesChange}
                                // trend={stats.last7daysEmployeesTrend}
                                />
                            </Col>
                        </Row>

                        {/* <NetwordCards data={dashboardData?.network} /> */}

                        <Row className="g-4 mt-4">
                            <Col lg={8}>
                                {/* <IncomeChart data={incomeData} /> */}
                            </Col>

                            <Col lg={4}>
                                {/* <RecentCustomers customers={recentEmployees} /> */}
                            </Col>
                        </Row>

                        <Row className="g-4 mt-2">
                            {/* Transactions List */}
                            <Col>
                                <AdminDashboardTransaction
                                    loading={tableLoading}
                                    handleFilterChange={handleFilterChange}
                                    transactions={dashboardData?.recentTransactions || []}
                                    total={dashboardData?.pagination?.totalCount || 0}
                                    filters={filters}
                                    setFilters={setFilters}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                    isDashboard={true}
                                    selectedTab={selectedTab}
                                    setSelectedTab={setSelectedTab}
                                />
                            </Col>
                        </Row>
                    </div>
                </>
            {/* )} */}
        </MainLayout >
    );
};

export default Dashboard;