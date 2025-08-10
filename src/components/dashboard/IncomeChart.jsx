import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const IncomeChart = () => {
  const [timeframe, setTimeframe] = useState('12 Months');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const chartRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data - replace with your actual data
  const data = [
    { name: 'Feb', income: 250, trend: 220 },
    { name: 'Mar', income: 280, trend: 235 },
    { name: 'Apr', income: 294.5, trend: 240 },
    { name: 'May', income: 270, trend: 245 },
    { name: 'Jun', income: 245.91, trend: 250 },
    { name: 'Jul', income: 260, trend: 255 },
    { name: 'Aug', income: 275, trend: 260 },
    { name: 'Sep', income: 290, trend: 265 },
    { name: 'Oct', income: 285, trend: 270 },
    { name: 'Nov', income: 305, trend: 275 },
    { name: 'Dec', income: 324, trend: 280 },
    { name: 'Jan', income: 320, trend: 285 },
  ];

  // Custom tooltip to match the design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-sm rounded" style={{ border: '1px solid #f0f0f0' }}>
          <p className="mb-0">{`${payload[0].payload.name} 2025`}</p>
          <p className="font-weight-bold mb-0">${Number(payload[0].value).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  // PDF Export function
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const chartElement = chartRef.current;
      
      if (!chartElement) {
        console.error("Chart element not found");
        return;
      }

      // Define PDF dimensions
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Create canvas from chart element
      const canvas = await html2canvas(chartElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Get the canvas data as an image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgWidth = pdfWidth - 40; // Margins on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title
      pdf.setFontSize(18);
      pdf.text(`Income Overview - ${timeframe}`, 20, 20);
      
      // Add timestamp
      pdf.setFontSize(10);
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated on: ${timestamp}`, 20, 30);
      
      // Add the chart image
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`Income_Overview_${timeframe.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border border-0 shadow rounded-5">
      <Card.Body className="p-3 p-md-4" ref={chartRef}>
        <Row className="align-items-center mb-4">
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <h6 className="fw-bold mb-1">Income Overview</h6>
          </Col>

          <Col xs={12} md={8}>
            <div className="d-flex flex-wrap justify-content-md-end gap-2">
             
              <div className="btn-group me-3">
                {['12 Months', '6 Months', '30 Days', '7 Days'].map(option => (
                  <Button
                    key={option}
                    variant={timeframe === option ? '' : ''}
                    size="sm"
                    className={`${timeframe === option ? 'border border-2 rounded' : ''}`}
                    onClick={() => setTimeframe(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Export button */}
              <Button
                variant="outline-dark"
                size="sm"
                className="d-flex align-items-center fw-bold rounded"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none" className="me-1">
                  <path d="M8.00016 6.33373V9.9701M8.00016 9.9701L6.00016 8.15191M8.00016 9.9701L10.0002 8.15191M11.3335 13.0004H4.66683C3.93045 13.0004 3.3335 12.4577 3.3335 11.7883V3.30343C3.3335 2.63399 3.93045 2.09131 4.66683 2.09131H8.39069C8.5675 2.09131 8.73707 2.15516 8.86209 2.26882L12.4716 5.55016C12.5966 5.66382 12.6668 5.81797 12.6668 5.97871V11.7883C12.6668 12.4577 12.0699 13.0004 11.3335 13.0004Z" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </Col>
        </Row>
      
       
        {/* Chart with responsive container */}
        <div style={{ height: windowWidth < 768 ? "220px" : "280px", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{
              top: 20,
              right: windowWidth < 768 ? 10 : 30,
              left: windowWidth < 768 ? 0 : 0,
              bottom: 5
            }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5e60ce" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5e60ce" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a8b2ff" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#a8b2ff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />

              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                interval={windowWidth < 576 ? 1 : 0}
              />

              <YAxis hide={true} />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference lines for month markers */}
              <ReferenceLine x="Jun" stroke="#e0e0e0" strokeDasharray="3 3" />
              <ReferenceLine x="Oct" stroke="#e0e0e0" strokeDasharray="3 3" />

              {/* Area gradients under the lines */}
              <Area
                type="monotone"
                dataKey="income"
                fill="url(#colorIncome)"
                stroke="none"
                fillOpacity={1}
              />

              <Area
                type="monotone"
                dataKey="trend"
                fill="url(#colorTrend)"
                stroke="none"
                fillOpacity={1}
              />

              {/* Income line */}
              <Line
                type="monotone"
                dataKey="income"
                stroke="#5e60ce"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#5e60ce" }}
              />

              {/* Trend line */}
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#a8b2ff"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#a8b2ff" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default IncomeChart;