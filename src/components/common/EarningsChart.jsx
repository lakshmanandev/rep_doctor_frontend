// import React, { useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import { Dropdown } from 'react-bootstrap';
// import { IoIosArrowDown } from 'react-icons/io';
// import useAuth from '../../hooks/useAuth';

// const EarningsChart = () => {
//   const { getAdminChartData } = useAuth();
//   const [chartData, setChartData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [type, setType] = useState('');


//   const chartOptions = {
//     chart: {
//       type: 'area',
//       zoom: {
//         enabled: true,
//         type: 'x',
//         autoScaleYaxis: true,
//       },
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true,
//         },
//       },
//       fontFamily: 'inherit',
//     },
//     colors: ['#10B981'],
//     dataLabels: { enabled: false },
//     stroke: { curve: 'smooth', width: 2 },
//     xaxis: {
//       type: 'category',
//       title: { text: 'Date' },
//     },
//     yaxis: {
//       title: { text: 'Earnings (USDT)' },
//       labels: {
//         formatter: (val) => `${val.toFixed(2)}`,
//       },
//     },
//     tooltip: {
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const data = chartData[dataPointIndex];
//         return `
//           <div style="padding:8px">
//             <strong>Date:</strong> ${data.x}<br/>
//             <strong>Tx ID:</strong> ${data.txId}<br/>
//             <strong>Amount:</strong> ${data.y.toFixed(2)} USDT
//           </div>
//         `;
//       },
//     },
//   };

//   const getAdminEarningsChartData = async () => {
//     try {
//       setChartLoading(true);
//       const data = {
//         filterType: filter,  //all, day, week, month,year
//         // type: type,       //bsc,eth,tron,polygon 
//       };
//       const response = await getAdminChartData(data);

//       if (response.success && response.data) {
//         const transformed = response.data.map(item => ({
//           x: item.date,
//           y: item.amount,
//           txId: item.transaction_id,
//         }));
//         setChartData(transformed);
//       } else {
//         setChartData([]);
//       }

//     } catch (err) {
//       setChartData([]);
//       setError(err.message);
//     } finally {
//       setChartLoading(false);
//     }
//   }

//   useEffect(() => {
//     getAdminEarningsChartData();
//   }, [filter, type]);


//   return (
//     <div>
//       <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
//         <h3 className="d-flex">Earnings Over Time</h3>
//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setFilter(value)}
//         >
//           <Dropdown.Toggle variant="success" id="filter-dropdown">
//             Date: {filter.charAt(0).toUpperCase() + filter.slice(1)} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="all">All</Dropdown.Item>
//             <Dropdown.Item eventKey="day">Day</Dropdown.Item>
//             <Dropdown.Item eventKey="week">Week</Dropdown.Item>
//             <Dropdown.Item eventKey="month">Month</Dropdown.Item>
//             <Dropdown.Item eventKey="year">Year</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>

//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setType(value)} // <- Fix here
//         >
//           <Dropdown.Toggle variant="success" id="network-dropdown">
//             Network: {type ? type.toUpperCase() : 'All'} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="">All</Dropdown.Item>
//             <Dropdown.Item eventKey="bsc">BSC</Dropdown.Item>
//             <Dropdown.Item eventKey="eth">ETH</Dropdown.Item>
//             <Dropdown.Item eventKey="tron">TRON</Dropdown.Item>
//             <Dropdown.Item eventKey="polygon">Polygon</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>

//       </div>

//       <Chart
//         options={chartOptions}
//         series={[{ name: 'Earnings', data: chartData }]}
//         type="area"
//         height={350}
//       />
//     </div>
//   );
// };

// export default EarningsChart;






// import React, { useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import { Dropdown } from 'react-bootstrap';
// import { IoIosArrowDown } from 'react-icons/io';
// import useAuth from '../../hooks/useAuth';

// const EarningsChart = () => {
//   const { getAdminChartData } = useAuth();

//   const [chartData, setChartData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [type, setType] = useState('');
//   const [error, setError] = useState(null);

//   const chartOptions = {
//     chart: {
//       type: 'area',
//       zoom: {
//         enabled: true,
//         type: 'x',
//         autoScaleYaxis: true,
//       },
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true,
//         },
//       },
//       fontFamily: 'inherit',
//     },
//     colors: ['#10B981', '#6366F1', '#F59E0B', '#EF4444'], // for BSC, ETH, TRON, POLYGON
//     dataLabels: { enabled: false },
//     stroke: { curve: 'smooth', width: 2 },
//     xaxis: {
//       type: 'category',
//       title: { text: 'Date' },
//     },
//     yaxis: {
//       title: { text: 'Earnings (USDT)' },
//       labels: {
//         formatter: (val) => `${val.toFixed(8)}`,
//       },
//     },
//     tooltip: {
//       shared: false,
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const data = w.config.series[seriesIndex].data[dataPointIndex];
//         const txIds = data.txIds?.join(', ') || 'N/A';
//         return `
//           <div style="padding:8px; max-width:300px; word-wrap:break-word">
//             <strong>Date:</strong> ${data.x}<br/>
//             <strong>Tx IDs:</strong> ${txIds}<br/>
//             <strong>Total:</strong> ${data.y.toFixed(8)} USDT
//           </div>
//         `;
//       },
//     },
//   };

//   const getAdminEarningsChartData = async () => {
//     try {
//       setChartLoading(true);
//       const params = {
//         filterType: filter,
//         type: type, // if empty, backend returns all types
//       };
//       const response = await getAdminChartData(params);

//       if (response.success && response.data) {
//         // Group by type and date, and sum amounts
//         const grouped = {};

//         response.data.forEach(item => {
//           const netType = item.type.toLowerCase();
//           const dateKey = item.date;

//           if (!grouped[netType]) {
//             grouped[netType] = {};
//           }

//           if (!grouped[netType][dateKey]) {
//             grouped[netType][dateKey] = {
//               total: 0,
//               transactions: [],
//             };
//           }

//           grouped[netType][dateKey].total += item.amount;
//           grouped[netType][dateKey].transactions.push(item.transaction_id);
//         });

//         // Apply network filter if selected
//         const filteredGrouped = type ? { [type]: grouped[type] || {} } : grouped;

//         // Convert to Apex format
//         const transformedSeries = Object.keys(filteredGrouped).map(net => ({
//           name: net.toUpperCase(),
//           data: Object.keys(filteredGrouped[net]).map(date => ({
//             x: date,
//             y: filteredGrouped[net][date].total,
//             txIds: filteredGrouped[net][date].transactions,
//           })),
//         }));

//         setChartData(transformedSeries);
//       } else {
//         setChartData([]);
//       }
//     } catch (err) {
//       setChartData([]);
//       setError(err.message);
//     } finally {
//       setChartLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAdminEarningsChartData();
//   }, [filter, type]);

//   return (
//     <div>
//       <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
//         <h3 className="d-flex">Earnings Over Time</h3>

//         {/* Date Filter Dropdown */}
//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setFilter(value)}
//         >
//           <Dropdown.Toggle variant="success" id="filter-dropdown">
//             Date: {filter.charAt(0).toUpperCase() + filter.slice(1)} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="all">All</Dropdown.Item>
//             <Dropdown.Item eventKey="day">Day</Dropdown.Item>
//             <Dropdown.Item eventKey="week">Week</Dropdown.Item>
//             <Dropdown.Item eventKey="month">Month</Dropdown.Item>
//             <Dropdown.Item eventKey="year">Year</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>

//         {/* Network Type Dropdown */}
//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setType(value)}
//         >
//           <Dropdown.Toggle variant="success" id="network-dropdown">
//             Network: {type ? type.toUpperCase() : 'All'} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="">All</Dropdown.Item>
//             <Dropdown.Item eventKey="bsc">BSC</Dropdown.Item>
//             <Dropdown.Item eventKey="eth">ETH</Dropdown.Item>
//             <Dropdown.Item eventKey="tron">TRON</Dropdown.Item>
//             <Dropdown.Item eventKey="polygon">Polygon</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>

//       {chartLoading ? (
//         <div className="text-center py-4">Loading chart...</div>
//       ) : (
//         <Chart
//           options={chartOptions}
//           series={chartData}
//           type="area"
//           height={350}
//         />
//       )}
//     </div>
//   );
// };

// export default EarningsChart;




// By Lahmanan
// import React, { useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import { Dropdown } from 'react-bootstrap';
// import { IoIosArrowDown } from 'react-icons/io';
// import useAuth from '../../hooks/useAuth';

// const EarningsChart = () => {
//   const { getAdminChartData } = useAuth();

//   const [chartData, setChartData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [type, setType] = useState('');
//   const [chartColors, setChartColors] = useState([]);
//   const [error, setError] = useState(null);

//   const typeColorMap = {
//     bsc: '#10B981',
//     eth: '#6366F1',
//     tron: '#F59E0B',
//     polygon: '#EF4444',
//   };

//   const chartOptions = {
//     chart: {
//       type: 'area',
//       zoom: {
//         enabled: true,
//         type: 'x',
//         autoScaleYaxis: true,
//       },
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: true,
//           zoom: true,
//           zoomin: true,
//           zoomout: true,
//           pan: true,
//           reset: true,
//         },
//       },
//       fontFamily: 'inherit',
//     },
//     colors: chartColors,
//     dataLabels: { enabled: false },
//     stroke: { curve: 'smooth', width: 2 },
//     xaxis: {
//       type: 'category',
//       title: { text: 'Date' },
//     },
//     yaxis: {
//       title: { text: 'Earnings (USDT)' },
//       // labels: {
//       //   formatter: (val) => Number(val).toExponential(2), // show tiny values like 3.00e-16
//       // },

//       labels: {
//         formatter: (val) => {
//           if (val === 0) return '0';
//           const absVal = Math.abs(val);

//           if (absVal < 1e-6) {
//             return val.toExponential(2); // too small, keep exponential
//           } else if (absVal < 0.01) {
//             return val.toFixed(8); // very small, show full decimals
//           } else if (absVal < 1) {
//             return val.toFixed(6);
//           } else if (absVal < 1000) {
//             return val.toFixed(2);
//           } else if (absVal < 1e6) {
//             return `${(val / 1000).toFixed(2)}K`;
//           } else if (absVal < 1e9) {
//             return `${(val / 1e6).toFixed(2)}M`;
//           } else {
//             return val.toExponential(2); // fallback for huge values
//           }
//         }
//       },

//     },
//     tooltip: {
//       shared: false,
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const data = w.config.series[seriesIndex].data[dataPointIndex];
//         const txIds = data.txIds?.join(', ') || 'N/A';
//         return `
//           <div style="padding:8px; max-width:300px; word-wrap:break-word">
//             <strong>Date:</strong> ${data.x}<br/>
//             <strong>Tx IDs:</strong> ${txIds}<br/>
//             <strong>Total:</strong> ${data.y.toExponential(2)} USDT
//           </div>
//         `;
//       },
//     },
//   };

//   const getAdminEarningsChartData = async () => {
//     try {
//       setChartLoading(true);

//       const params = {
//         filterType: filter,
//         type: type, // leave empty for all
//       };

//       const response = await getAdminChartData(params);

//       if (response.success && response.data) {
//         const grouped = {};

//         response.data.forEach((item) => {
//           const netType = item.type.toLowerCase();
//           const dateKey = item.date;

//           if (!grouped[netType]) {
//             grouped[netType] = {};
//           }

//           if (!grouped[netType][dateKey]) {
//             grouped[netType][dateKey] = {
//               total: 0,
//               transactions: [],
//             };
//           }

//           grouped[netType][dateKey].total += item.amount;
//           grouped[netType][dateKey].transactions.push(item.transaction_id);
//         });

//         const filteredGrouped = type ? { [type]: grouped[type] || {} } : grouped;

//         const transformedSeries = Object.keys(filteredGrouped).map((net) => ({
//           name: net.toUpperCase(),
//           data: Object.entries(filteredGrouped[net]).map(([date, info]) => ({
//             x: date,
//             y: info.total,
//             txIds: info.transactions,
//           })),
//         }));

//         const assignedColors = Object.keys(filteredGrouped).map(
//           (net) => typeColorMap[net] || '#999'
//         );

//         setChartData(transformedSeries);
//         setChartColors(assignedColors);
//       } else {
//         setChartData([]);
//         setChartColors([]);
//       }
//     } catch (err) {
//       setError(err.message);
//       setChartData([]);
//       setChartColors([]);
//     } finally {
//       setChartLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAdminEarningsChartData();
//   }, [filter, type]);

//   return (
//     <div>
//       <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
//         <h3 className="d-flex">Earnings Over Time</h3>

//         {/* Filter Dropdown */}
//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setFilter(value)}
//         >
//           <Dropdown.Toggle variant="success" id="filter-dropdown">
//             Date: {filter.charAt(0).toUpperCase() + filter.slice(1)} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="all">All</Dropdown.Item>
//             <Dropdown.Item eventKey="day">Day</Dropdown.Item>
//             <Dropdown.Item eventKey="week">Week</Dropdown.Item>
//             <Dropdown.Item eventKey="month">Month</Dropdown.Item>
//             <Dropdown.Item eventKey="year">Year</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>

//         {/* Network Dropdown */}
//         <Dropdown
//           style={{
//             border: '1px solid #ced4da',
//             borderRadius: '10px',
//             padding: '1px 12px',
//           }}
//           onSelect={(value) => setType(value)}
//         >
//           <Dropdown.Toggle variant="success" id="network-dropdown">
//             Network: {type ? type.toUpperCase() : 'All'} <IoIosArrowDown />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item eventKey="">All</Dropdown.Item>
//             <Dropdown.Item eventKey="bsc">BSC</Dropdown.Item>
//             <Dropdown.Item eventKey="eth">ETH</Dropdown.Item>
//             <Dropdown.Item eventKey="tron">TRON</Dropdown.Item>
//             <Dropdown.Item eventKey="polygon">POLYGON</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>

//       {chartLoading ? (
//         <div className="text-center py-4">Loading chart...</div>
//       ) : (
//         <Chart options={chartOptions} series={chartData} type="area" height={350} />
//       )}
//     </div>
//   );
// };

// export default EarningsChart;


















//SATZ
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Dropdown } from 'react-bootstrap';
import { IoIosArrowDown } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';

const EarningsChart = () => {
  const { getAdminChartData } = useAuth();

  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [type, setType] = useState('');
  const [chartColors, setChartColors] = useState([]);
  const [error, setError] = useState(null);

  const typeColorMap = {
    bsc: '#10B981',
    eth: '#6366F1',
    tron: '#F59E0B',
    polygon: '#EF4444',
  };

  // 🧠 Formatter for all Y-axis and tooltip values
  const formatYValue = (val) => {
    if (val === 0) return '0';
    const absVal = Math.abs(val);

    if (absVal < 1e-6) return val.toExponential(2);
    else if (absVal < 0.01) return val.toFixed(8);
    else if (absVal < 1) return val.toFixed(6);
    else if (absVal < 1000) return val.toFixed(2);
    else if (absVal < 1e6) return `${(val / 1000).toFixed(2)}K`;
    else if (absVal < 1e9) return `${(val / 1e6).toFixed(2)}M`;
    else return val.toExponential(2);
  };

  const chartOptions = {
    chart: {
      type: 'area',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      fontFamily: 'inherit',
    },
    colors: chartColors,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      type: 'category',
      title: { text: 'Date' },
    },
    yaxis: {
      title: { text: 'Earnings (USDT)' },
      labels: {
        formatter: (val) => formatYValue(val),
      },
    },
    tooltip: {
      shared: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const txIds = data.txIds?.join(', ') || 'N/A';
        return `
          <div style="padding:8px; max-width:300px; word-wrap:break-word">
            <strong>Date:</strong> ${data.x}<br/>
            <strong>Tx IDs:</strong> ${txIds}<br/>
            <strong>Total:</strong> ${formatYValue(data.y)} USDT
          </div>
        `;
      },
    },
  };

  const getAdminEarningsChartData = async () => {
    try {
      setChartLoading(true);

      const params = {
        filterType: filter,
        type: type,
      };

      const response = await getAdminChartData(params);

      if (response.success && response.data) {
        const grouped = {};

        response.data.forEach((item) => {
          const netType = item.type.toLowerCase();
          const dateKey = item.date;

          if (!grouped[netType]) {
            grouped[netType] = {};
          }

          if (!grouped[netType][dateKey]) {
            grouped[netType][dateKey] = {
              total: 0,
              transactions: [],
            };
          }

          grouped[netType][dateKey].total += item.amount;
          grouped[netType][dateKey].transactions.push(item.transaction_id);
        });

        const filteredGrouped = type ? { [type]: grouped[type] || {} } : grouped;

        const transformedSeries = Object.keys(filteredGrouped).map((net) => ({
          name: net.toUpperCase(),
          data: Object.entries(filteredGrouped[net]).map(([date, info]) => ({
            x: date,
            y: info.total,
            txIds: info.transactions,
          })),
        }));

        const assignedColors = Object.keys(filteredGrouped).map(
          (net) => typeColorMap[net] || '#999'
        );

        setChartData(transformedSeries);
        setChartColors(assignedColors);
      } else {
        setChartData([]);
        setChartColors([]);
      }
    } catch (err) {
      setError(err.message);
      setChartData([]);
      setChartColors([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    getAdminEarningsChartData();
  }, [filter, type]);

  return (
    <div>
      <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
        <h3 className="d-flex">Earnings Over Time</h3>

        {/* Filter Dropdown */}
        <Dropdown
          style={{
            border: '1px solid #ced4da',
            borderRadius: '10px',
            padding: '1px 12px',
          }}
          onSelect={(value) => setFilter(value)}
        >
          <Dropdown.Toggle variant="success" id="filter-dropdown">
            Date: {filter.charAt(0).toUpperCase() + filter.slice(1)} <IoIosArrowDown />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="all">All</Dropdown.Item>
            <Dropdown.Item eventKey="day">Day</Dropdown.Item>
            <Dropdown.Item eventKey="week">Week</Dropdown.Item>
            <Dropdown.Item eventKey="month">Month</Dropdown.Item>
            <Dropdown.Item eventKey="year">Year</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Network Dropdown */}
        <Dropdown
          style={{
            border: '1px solid #ced4da',
            borderRadius: '10px',
            padding: '1px 12px',
          }}
          onSelect={(value) => setType(value)}
        >
          <Dropdown.Toggle variant="success" id="network-dropdown">
            Network: {type ? type.toUpperCase() : 'All'} <IoIosArrowDown />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="">All</Dropdown.Item>
            <Dropdown.Item eventKey="bsc">BSC</Dropdown.Item>
            <Dropdown.Item eventKey="eth">ETH</Dropdown.Item>
            <Dropdown.Item eventKey="tron">TRON</Dropdown.Item>
            <Dropdown.Item eventKey="polygon">POLYGON</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {chartLoading ? (
        <div className="text-center py-4">Loading chart...</div>
      ) : (
        <Chart options={chartOptions} series={chartData} type="area" height={350} />
      )}
    </div>
  );
};

export default EarningsChart;
