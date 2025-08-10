import React from 'react';
import Chart from 'react-apexcharts';

const NetworkDistribution = ({ data }) => {
  const totals = {};

  data.forEach((txn) => {
    const network = txn.network;
    const amount = parseFloat(txn.amount);
    totals[network] = (totals[network] || 0) + amount;
  });

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  const options = {
    chart: { type: 'donut' },
    labels,
    colors: ['#6366F1', '#10B981', '#F59E0B', '#EF4444'],
    legend: { position: 'bottom' },
    tooltip: {
      y: { formatter: (val) => `${val.toExponential(2)} USDT` },
    },
  };

  const series = values;

  return <Chart options={options} series={series} type="donut" height={300} />;
};

export default NetworkDistribution;
