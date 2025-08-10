import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { RiBnbFill } from 'react-icons/ri';
import { FaEthereum } from 'react-icons/fa';
import { GiDiamondHard } from "react-icons/gi";
import { PiPolygonBold } from 'react-icons/pi';
import { formatCurrency } from '../../utils/formatters';

const iconMap = {
  BEP20: <RiBnbFill />,
  ERC20: <FaEthereum />,
  POLYGON: <PiPolygonBold />,
  TRC20: <GiDiamondHard />,
};

const colorMap = {
  BEP20: '#f3ba2f', // BNB
  ERC20: '#3c3c3d', // ETH
  POLYGON: '#7342DC',
  TRC20: '#e50914', // TRON
};

const bgMap = {
  BEP20: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))',
  ERC20: 'linear-gradient(135deg, rgba(64, 64, 64, 0.3), rgba(150, 150, 150, 0.1))',
  POLYGON: 'linear-gradient(135deg, rgba(123, 97, 255, 0.3), rgba(189, 178, 255, 0.1))',
  TRC20: 'linear-gradient(135deg, rgba(220, 20, 20, 0.4), rgba(255, 99, 99, 0.1))',
};

const chartOptions = {
  chart: {
    type: 'area',
    sparkline: { enabled: true }
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: { opacity: 0.3 },
  tooltip: { enabled: false },
  xaxis: { type: 'datetime' },
};

const NetwordCards = ({ data, gasfees = false }) => {
  if (!data) return null;

  // const cards = Object.entries(data).map(([key, value]) => ({
  //   title: key,
  //   value: value,
  //   icon: iconMap[key] || <GiDiamondHard />,
  //   change: "+0%", // Placeholder or you can calculate based on trends
  //   bgGradient: bgMap[key] || 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.03))',
  //   color: colorMap[key] || '#555'
  // }));

  const networkKeyMap = {
    bnb: 'BEP20',
    polygon: 'POLYGON',
    tron: 'TRC20',
    BEP20: 'BEP20',
    POLYGON: 'POLYGON',
    TRC20: 'TRC20',
    ERC20: 'ERC20',
  };


  const cards = Object.entries(data).map(([key, value]) => {
    const networkKey = networkKeyMap[key] || key;

    return {
      title: key,
      value,
      icon: iconMap[networkKey] || <GiDiamondHard />,
      change: "+0%",
      bgGradient: bgMap[networkKey] || 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.03))',
      color: colorMap[networkKey] || '#555',
    };
  });


  return (
    <Row className="g-4 mt-2">
      {cards.map((card, idx) => (
        <Col key={idx} lg={3} md={6}>
          <Card className="border-0 shadow position-relative" style={{ borderRadius: '16px', backgroundImage: card.bgGradient, overflow: 'hidden' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ fontSize: '32px', color: card.color, opacity: 0.6 }}>{card.icon}</div>
                {/* <span className="fw-semibold" style={{ color: card.color }}>{card.change}</span> */}
              </div>
              <div className="mt-3">
                <div className="text-muted fw-semibold" style={{ fontSize: '14px' }}>{card.title}</div>
                {/* <div className="fw-bold" style={{ fontSize: '24px' }}>{formatCurrency(card.value)}</div> */}

                <div className="fw-bold" style={{ fontSize: '24px' }}>
                  {gasfees
                    ? `${formatCurrency(
                      typeof card.value === 'object' ? card.value.balance : card.value
                    )} ${card?.value?.symbol || ''}`
                    : `$${formatCurrency(card.value)}`}
                </div>

              </div>
              <div className="mt-3">
                <Chart
                  options={{ ...chartOptions, colors: [card.color] }}
                  series={[{ data: [10, 20, 30, 25, 35, 50, 40] }]} // static for now
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

export default NetwordCards;




// import React from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import Chart from 'react-apexcharts';
// import { RiBnbFill } from 'react-icons/ri';
// import { FaEthereum } from 'react-icons/fa';
// import { GiDiamondHard } from "react-icons/gi";
// import { PiPolygonBold } from 'react-icons/pi';
// import CountUp from 'react-countup'; // ✅ Import CountUp
// import { formatCurrency } from '../../utils/formatters';

// const iconMap = {
//   BEP20: <RiBnbFill />,
//   ERC20: <FaEthereum />,
//   POLYGON: <PiPolygonBold />,
//   TRC20: <GiDiamondHard />,
// };

// const colorMap = {
//   BEP20: '#f3ba2f',
//   ERC20: '#3c3c3d',
//   POLYGON: '#7342DC',
//   TRC20: '#e50914',
// };

// const bgMap = {
//   BEP20: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))',
//   ERC20: 'linear-gradient(135deg, rgba(64, 64, 64, 0.3), rgba(150, 150, 150, 0.1))',
//   POLYGON: 'linear-gradient(135deg, rgba(123, 97, 255, 0.3), rgba(189, 178, 255, 0.1))',
//   TRC20: 'linear-gradient(135deg, rgba(220, 20, 20, 0.4), rgba(255, 99, 99, 0.1))',
// };

// const chartOptions = {
//   chart: {
//     type: 'area',
//     sparkline: { enabled: true }
//   },
//   stroke: { curve: 'smooth', width: 2 },
//   fill: { opacity: 0.3 },
//   tooltip: { enabled: false },
//   xaxis: { type: 'datetime' },
// };

// const NetwordCards = ({ data }) => {
//   if (!data) return null;

//   const cards = Object.entries(data).map(([key, value]) => ({
//     title: key,
//     value: value,
//     icon: iconMap[key] || <GiDiamondHard />,
//     change: "+0%",
//     bgGradient: bgMap[key] || 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.03))',
//     color: colorMap[key] || '#555'
//   }));

//   return (
//     <Row className="g-4 mt-3">
//       {cards.map((card, idx) => (
//         <Col key={idx} lg={3} md={6}>
//           <Card className="border-0 shadow position-relative" style={{ borderRadius: '16px', backgroundImage: card.bgGradient, overflow: 'hidden' }}>
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div style={{ fontSize: '32px', color: card.color, opacity: 0.6 }}>{card.icon}</div>
//                 <span className="fw-semibold" style={{ color: card.color }}>{card.change}</span>
//               </div>
//               <div className="mt-3">
//                 <div className="text-muted fw-semibold" style={{ fontSize: '14px' }}>{card.title}</div>
//                 <div className="fw-bold" style={{ fontSize: '24px' }}>
//                   <CountUp
//                     start={0}
//                     end={card.value}
//                     duration={1.5}
//                     separator=","
//                     decimals={2}
//                     prefix="$"
//                   />
//                 </div>
//               </div>
//               <div className="mt-3">
//                 <Chart
//                   options={{ ...chartOptions, colors: [card.color] }}
//                   series={[{ data: [10, 20, 30, 25, 35, 50, 40] }]}
//                   type="area"
//                   height={56}
//                   width="100%"
//                 />
//               </div>
//             </Card.Body>
//             <span
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: -20,
//                 width: 240,
//                 height: 240,
//                 backgroundColor: card.color,
//                 maskImage: "url('https://free.minimals.cc/assets/background/shape-square.svg')",
//                 maskSize: "contain",
//                 maskRepeat: "no-repeat",
//                 opacity: 0.2,
//                 zIndex: 0,
//               }}
//             ></span>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default NetwordCards;
