import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Container, Row, Col, Button, Dropdown, Card } from 'react-bootstrap';
import { Plus, Eye, Edit } from 'react-feather';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import useAuth from '../../../hooks/useAuth';
import FilterBar from '../../../components/common/FilterBar';
import { MdOutlineLockReset } from 'react-icons/md';
import { RiDeleteBin5Line } from "react-icons/ri";
import { toastAlert } from '../../../utils/toast';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import ResetPasswordModal from '../../../components/common/ResetPasswordModal';
import StatsCard from '../../../components/dashboard/StatsCard';
import NetwordCards from '../../../components/dashboard/NetworkCards';
import { formatCurrency } from '../../../utils/formatters';
import CustomTransactionLoader from '../../../components/common/Loader';
import PageLoader from '../../../components/common/PageLoader';
import log from '../../../utils/logger';

const Vendors = () => {
  const navigate = useNavigate();
  const { getVendors, resetVendorPassword, deleteVendor } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);      // Full page loader
  const [tableLoading, setTableLoading] = useState(false);   // Table-only loader

  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
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


  const handleFilterChange = (updatedFilters) => {
    const isSame =
      JSON.stringify(updatedFilters) === JSON.stringify(filters);

    if (!isSame) {
      setFilters(updatedFilters);
      setCurrentPage(1);
    }
  };


  const fetchVendors = async (isInitial = false) => {
    const data = {
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
    };
    try {
      isInitial ? setPageLoading(true) : setTableLoading(true);
      const response = await getVendors(data);
      log("response", response)
      if (response.success) {
        setVendors(response.data || []);
        setTotalItems(response.data.total || 0);
      } else {
        setVendors([]);
        setTotalItems(0);
      }
    } catch (error) {
      log("error", error)
      setError(error.message);
    } finally {
      isInitial ? setPageLoading(false) : setTableLoading(false);
    }
  };

  // Re-fetch when filters or pagination change
  useEffect(() => {
    fetchVendors(false);
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchVendors(true);
  }, []);


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
            <Dropdown.Item onClick={() => navigate(`/admin/vendors/edit/${row.encrypted_id}`)}>
              <Edit size={14} className="me-2" /> Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(`/admin/vendors/${row.encrypted_id}`)}>
              <Eye size={14} className="me-2" /> View
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleOpenResetModal(row.encrypted_id)}>
              <MdOutlineLockReset size={14} className="me-2" /> Reset Password
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleOpenDeleteModal(row.encrypted_id)}>
              <RiDeleteBin5Line size={14} className="me-2" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];


  const handleOpenResetModal = (id) => {
    setSelectedVendorId(id);
    setResetPassword('');
    setConfirmPassword('');
    setShowResetModal(true);
  };

  const handleResetSubmit = async () => {
    if (resetPassword !== confirmPassword) {
      toastAlert("error", "Passwords do not match");
      return;
    }

    try {
      const data = {
        id: selectedVendorId,
        newPassword: resetPassword
      }
      const res = await resetVendorPassword(data);
      log("res", res)
      if (res.success) {
        toastAlert("success", "Password reset successfully");
        setShowResetModal(false);
      } else {
        toastAlert("error", res.message || "Failed to reset password");
      }
    } catch (err) {
      toastAlert("error", "Server error");
    }
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedVendorId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteVendor(selectedVendorId); // You should implement this in useAuth
      if (res.success) {
        toastAlert("success", "Vendor deleted successfully");
        fetchVendors(); // refresh table
        setShowDeleteModal(false);
      } else {
        toastAlert("error", res.message || "Failed to delete vendor");
      }
    } catch (err) {
      toastAlert("error", "Server error");
    }
  };

  return (
    <MainLayout title="AKC Vendors">
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
          <Container fluid className="p-3">
            <Row className="g-4 mb-4">
              <Col xs={12} md={6} lg={3}>
                <StatsCard
                  title="TOTAL VENDORS"
                  value={vendors?.vendorsStaticstics?.total}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <StatsCard
                  title="ACTIVE VENDORS"
                  value={vendors?.vendorsStaticstics?.active}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <StatsCard
                  title="INACTIVE VENDORS"
                  value={vendors?.vendorsStaticstics?.inactive}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <StatsCard
                  title="LAST 7 DAYS VENDORS"
                  value={vendors?.vendorsStaticstics?.last7Days}
                />
              </Col>
            </Row>

            <NetwordCards data={vendors?.network} />

            <Row className="align-items-center justify-content-between mt-3 px-4">
              <Col md={6}>
                <h3>Vendors List</h3>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="primary" onClick={() => navigate('/admin/vendors/add')}>
                  <Plus size={14} className="me-1" /> Add Vendor
                </Button>
              </Col>
            </Row>

            <Card className="p-3 border-0 shadow rounded-4 mt-3">
              <Card.Header className="bg-white border-0 mb-2">
                <FilterBar showVendor={true} showEmployee={false} onFilterChange={handleFilterChange} />

              </Card.Header>

              <div style={{ overflowX: 'auto' }}>
                <DataTable
                  columns={columns}
                  data={vendors?.vendors}
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
          </Container>

          <ResetPasswordModal
            show={showResetModal}
            onHide={() => setShowResetModal(false)}
            onSubmit={handleResetSubmit}
            password={resetPassword}
            confirmPassword={confirmPassword}
            setPassword={setResetPassword}
            setConfirmPassword={setConfirmPassword}
          />

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
          />

        </>)}

    </MainLayout>
  );
};

export default Vendors;
