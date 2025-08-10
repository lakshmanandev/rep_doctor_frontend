import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';

const EmployeeTransactionFilterBar = ({ employeeId, adminsideEmployeedetail, dashboard = false, onFilterChange }) => {
    const { VendorgetEmployeesAddress, getEmployeesAddress } = useAuth();
    const [vendorEmployeeOptions, setVendorEmployeeOptions] = useState([]);
    const [vendorSelectedEmployees, setVendorSelectedEmployees] = useState([]);

    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (dashboard) { //vendor page emp detail trasaction addres filter
                const res = await VendorgetEmployeesAddress({ employeeId: employeeId }); // You need this in useAuth
                if (res.success) {
                    const empOpts = res?.data.map(e => ({ value: e.address, label: `${e.address}` })) || [];
                    setVendorEmployeeOptions(empOpts);
                }

            }
            if (adminsideEmployeedetail) {
                const res = await getEmployeesAddress({ employeeId: employeeId }); // You need this in useAuth
                if (res.success) {
                    const empOpts = res?.data.map(e => ({ value: e.address, label: `${e.address}` })) || [];
                    setEmployeeOptions(empOpts);
                }
            }
        };

        fetchData();
    }, [dashboard, adminsideEmployeedetail]);
    
    useEffect(() => {
        const selectedAddresses = dashboard
            ? vendorSelectedEmployees.map(e => e.value)
            : selectedEmployees.map(e => e.value);

        onFilterChange({
            addresses: selectedAddresses,
            fromDate,
            toDate,
        });
    }, [vendorSelectedEmployees, selectedEmployees, fromDate, toDate]);


    return (
        <Form className="mb-3">
            <Row className="align-items-end g-3">
                {dashboard && (
                    <Col md={4}>
                        <Select
                            isMulti
                            options={vendorEmployeeOptions}
                            value={vendorSelectedEmployees}
                            onChange={setVendorSelectedEmployees}
                            placeholder="Filter by Address"
                        />
                    </Col>
                )}

                {adminsideEmployeedetail && (
                    <Col md={4}>
                        <Select
                            isMulti
                            options={employeeOptions}
                            value={selectedEmployees}
                            onChange={setSelectedEmployees}
                            placeholder="Filter by Address"
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

export default EmployeeTransactionFilterBar;

