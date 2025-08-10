import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';

const cardData = [
  {
    title: "TOTAL EMPLOYEES",
    value: "714k",
    icon: <FaUsersGear />,
    change: "+2.6%",
    bgGradient: "linear-gradient(135deg, rgba(0,123,255,0.3), rgba(0,123,255,0.1))",
    color: "#007bff",
  },
  {
    title: "ACTIVE EMPLOYEES",
    value: "1.35m",
    icon: <FaUserCheck />,
    change: "-0.1%",
    bgGradient: "linear-gradient(135deg, rgba(102,16,242,0.3), rgba(102,16,242,0.1))",
    color: "#6610f2",
  },
  {
    title: "INACTIVE EMPLOYEES",
    value: "1.72m",
    icon: <FaUserTimes />,
    change: "+2.8%",
    bgGradient: "linear-gradient(135deg, rgba(220,53,69,0.3), rgba(220,53,69,0.1))",
    color: "#dc3545",

  },
  {
    title: "LAST 7 DAYS EMPLOYEES",
    value: "234",
    icon: <FaUsersGear />,
    change: "+3.6%",
    bgGradient: "linear-gradient(135deg, rgba(255,193,7,0.3), rgba(255,193,7,0.1))",
    color: "#ffc107",

  },
];

const chartOptions = {
  chart: {
    type: 'area',
    sparkline: {
      enabled: true
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    opacity: 0.3,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
  },
};

const DashboardCards = () => {
  return (
    <Row className="g-4">
      {cardData.map((card, idx) => (
        <Col key={idx} lg={3} md={6}>
          <Card className="border-0 shadow position-relative" style={{ borderRadius: '16px', backgroundImage: card.bgGradient, overflow: 'hidden' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ fontSize: '32px', color: card.color, opacity: 0.6 }}>{card.icon}</div>
                <span className="fw-semibold" style={{ color: card.color }}>{card.change}</span>
              </div>
              <div className="mt-3">
                <div className="text-muted fw-semibold" style={{ fontSize: '14px' }}>{card.title}</div>
                <div className="fw-bold" style={{ fontSize: '24px' }}>{card.value}</div>
              </div>
              <div className="mt-3">
                <Chart
                  options={{ ...chartOptions, colors: [card.color] }}
                  series={[{ data: [10, 40, 25, 50, 40, 65, 30] }]}
                  type="area"
                  height={56}
                  width="100%"
                />
              </div>
            </Card.Body>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: -20,
                width: 240,
                height: 240,
                backgroundColor: card.color,
                maskImage: "url('https://free.minimals.cc/assets/background/shape-square.svg')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                opacity: 0.2,
                zIndex: 0,
              }}
            ></span>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardCards;
