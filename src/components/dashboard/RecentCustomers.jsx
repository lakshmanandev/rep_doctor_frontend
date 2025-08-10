import React from "react";
import { Card, Image, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RecentCustomers = ({ customers }) => {

  const navigate = useNavigate();
  const handleSeeAllCustomers = (e) => {
    e.preventDefault();
    navigate("/customers");
  };
  return (
    <Card className="h-100 shadow rounded-5 border border-0">
      <Card.Body className="p-4">
        <h5 className="card-title mb-3">Recent Employees</h5>

        <div className="table-responsive">
          <Table className="table align-middle m-0 table-borderless">
            {/* <thead className="bg-light">
              <tr>
                <th>Customer</th>
                <th className="text-end">Amount & Location</th>
              </tr>
            </thead> */}
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="customer-table-row">
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        src={customer.avatar}
                        alt={customer.name}
                        roundedCircle
                        width={40}
                        height={40}
                        className="me-3"
                      />
                      <div>
                        <p className="mb-0 fw-medium">{customer.name}</p>
                        <p className="text-muted small mb-0">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <p className="mb-0 fw-medium">
                      ${customer.amount.toLocaleString()}
                    </p>
                    <p className="text-muted small mb-0">{customer.location}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="mt-4 alcus" onClick={handleSeeAllCustomers} style={{cursor:"pointer"}}>
          See all Employees{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
          >
            <g opacity="0.5">
              <path
                d="M5.25 3.41683L9.33333 7.50016L5.25 11.5835"
                stroke="#151518"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecentCustomers;