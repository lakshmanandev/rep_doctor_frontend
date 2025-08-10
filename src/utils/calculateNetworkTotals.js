// utils/calculateNetworkTotals.js

export const calculateNetworkTotals = (transactions) => {
  const totals = {
    TRC20: 0,
    ERC20: 0,
    BEP20: 0,
    POLYGON: 0,
  };

  transactions.forEach((tx) => {
    const net = tx.network.toLowerCase();

    if (net === 'bsc') totals.BEP20 += parseFloat(tx.amount);
    else if (net === 'tron') totals.TRC20 += parseFloat(tx.amount);
    else if (net === 'eth' || net === 'ethereum') totals.ERC20 += parseFloat(tx.amount);
    else if (net === 'polygon') totals.POLYGON += parseFloat(tx.amount);
  });

  return totals;
};
