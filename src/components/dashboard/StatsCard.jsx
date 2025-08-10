// // StatsCard.jsx - Card component for statistics with Bootstrap
// import React from 'react';
// import { Card } from 'react-bootstrap';

// const StatsCard = ({ title, value, change, trend }) => {
//   // Format numbers with commas
//   const formattedValue = typeof value === 'number' ?
//     new Intl.NumberFormat('en-US').format(value) :
//     value;

//   return (
//     <Card className="h-100 shadow rounded-4 border-0">
//       <Card.Body className="p-4">
//         <h6 className="text-muted small">{title}</h6>
//         <div className="d-flex align-items-baseline mt-2">
//           <h3 className="fw-bold">{formattedValue}</h3>
//           {/* <div className={`ms-2 d-flex align-items-center small justify-content-end w-100 ${trend === 'up' ? 'txt-success' : 'txt-danger'}`}>
//             <span className={`fw-semibold fs-6 d-flex align-items-center gap-1`}>
//               {trend === 'up' ? (
//                 <i className="bi bi-arrow-up text-success"></i>
//               ) : (
//                 <i className="bi bi-arrow-down text-danger"></i>
//               )}
//               {change}
//             </span>
//           </div> */}
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default StatsCard;



// StatsCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import CountUp from 'react-countup';

const StatsCard = ({ title, value, change, trend }) => {
  const isNumber = typeof value === 'number';

  return (
    <Card className="h-100 shadow rounded-4 border-0">
      <Card.Body className="p-4">
        <h6 className="text-muted small">{title}</h6>
        <div className="d-flex align-items-baseline mt-2">
          <h3 className="fw-bold">
            {isNumber ? (
              <CountUp
                start={0}
                end={value}
                duration={2.5}
                separator=","
              />
            ) : (
              value
            )}
          </h3>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;