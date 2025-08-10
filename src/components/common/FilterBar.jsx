import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';

const FilterBar = ({ showVendor = false, showEmployee = false, showVendorPageEmployee = false, onFilterChange }) => {
    const { getVendorsName, getEmployeesName, VendorgetEmployeesName } = useAuth();
    const [vendorOptions, setVendorOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [vendorEmployeeOptions, setVendorEmployeeOptions] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [vendorSelectedEmployees, setVendorSelectedEmployees] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (showVendor) {
                const res = await getVendorsName();
                const vendorOpts = res?.vendors.map(v => ({ value: v.encrypted_id, label: `${v.username} (${v.email})` })) || [];
                setVendorOptions(vendorOpts);
            }

            if (showEmployee) {
                const res = await getEmployeesName(); // You need this in useAuth
                const empOpts = res?.employees.map(e => ({ value: e.encrypted_id, label: `${e.username} (${e.email})` })) || [];
                setEmployeeOptions(empOpts);
            }

            if (showVendorPageEmployee) {
                const res = await VendorgetEmployeesName(); // You need this in useAuth
                const empOpts = res?.employees.map(e => ({ value: e.encrypted_id, label: `${e.username} (${e.email})` })) || [];
                setVendorEmployeeOptions(empOpts);
            }
        };

        fetchData();
    }, [showVendor, showEmployee, showVendorPageEmployee]);

    useEffect(() => {
        onFilterChange({
            vendorIds: selectedVendors.map(v => v.value),
            employeeId: selectedEmployees.map(e => e.value),
            employeeIds: vendorSelectedEmployees.map(e => e.value),
            fromDate,
            toDate,
        });
    }, [selectedVendors, selectedEmployees, vendorSelectedEmployees, fromDate, toDate]);

    return (
        <Form className="mb-3">
            <Row className="align-items-end g-3">
                {showVendor && (
                    <Col md={4}>
                        <Select
                            isMulti
                            options={vendorOptions}
                            value={selectedVendors}
                            onChange={setSelectedVendors}
                            placeholder="Filter by vendors"
                        />
                    </Col>
                )}
                {showEmployee && (
                    <Col md={4}>
                        <Select
                            isMulti
                            options={employeeOptions}
                            value={selectedEmployees}
                            onChange={setSelectedEmployees}
                            placeholder="Filter by employees"
                        />
                    </Col>
                )}

                {showVendorPageEmployee && (
                    <Col md={4}>
                        <Select
                            isMulti
                            options={vendorEmployeeOptions}
                            value={vendorSelectedEmployees}
                            onChange={setVendorSelectedEmployees}
                            placeholder="Filter by employees"
                        />
                    </Col>
                )}
                <Col md={2} className="position-relative">
                    <Form.Control
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    {fromDate && (
                        <span
                            className="clear-icon"
                            onClick={() => setFromDate('')}
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: '#888',
                            }}
                        >
                            ×
                        </span>
                    )}
                </Col>

                {/* <Col md={2}>
                    <DatePicker
                        selected={fromDate ? new Date(fromDate) : null}
                        onChange={(date) => setFromDate(date?.toISOString().split('T')[0])}
                        className="form-control"
                        placeholderText="From Date"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                    />
                </Col> */}

                <Col md={2} className="position-relative">
                    <Form.Control
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    {toDate && (
                        <span
                            className="clear-icon"
                            onClick={() => setToDate('')}
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: '#888',
                            }}
                        >
                            ×
                        </span>
                    )}
                </Col>

            </Row>
        </Form>
    );
};

export default FilterBar;

