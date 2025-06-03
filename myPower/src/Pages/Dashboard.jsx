import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';

const Dashboard = () => {
  const [groupBy, setGroupBy] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState({ labels: [], powerData: [] });
  const [summary, setSummary] = useState({ totalPower: 0, entryCount: 0, usageTimeInHours: 0 });
  const [todayVsYesterday, setTodayVsYesterday] = useState({
    yesterday: { power: 0 },
    today: { power: 0 },
  });
  const [loading, setLoading] = useState(false);
  const fullCapacity = 700; // example capacity in kWh
  const maxPercentage = 400; // Allow the gauge to represent up to 400%

  const formatDateWithTime = (date, start = true) => {
    const d = new Date(date);
    if (start) d.setHours(0, 0, 0, 0);
    else d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const params = {
        groupBy,
        ...(startDate && { startDate: formatDateWithTime(startDate, true) }),
        ...(endDate && { endDate: formatDateWithTime(endDate, false) }),
      };

      const token = localStorage.getItem('token');
      const { data: responseData } = await axios.get('http://localhost:3001/chartroute/data', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const labels = responseData.data.map(item => item.period.split('T')[0]);
      const powerData = responseData.data.map(item => parseFloat(item.total));
      const totalPower = powerData.reduce((sum, val) => sum + val, 0);
      const entryCount = responseData.data.length;
      const usageTimeInHours = startDate && endDate && !isNaN(new Date(endDate) - new Date(startDate))
        ? (new Date(endDate) - new Date(startDate)) / 1000 / 3600
        : 0;

      setChartData({ labels, powerData });
      setSummary({ totalPower, entryCount, usageTimeInHours });
    } catch (error) {
      console.error('Error fetching chart data:', error.response?.data || error.message);
      setChartData({ labels: [], powerData: [] });
      setSummary({ totalPower: 0, entryCount: 0, usageTimeInHours: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayVsYesterday = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const todayStr = formatDateWithTime(today, true);
      const todayEndStr = formatDateWithTime(today, false);
      const yesterdayStr = formatDateWithTime(yesterday, true);
      const yesterdayEndStr = formatDateWithTime(yesterday, false);

      const token = localStorage.getItem('token');
      const [todayRes, yesterdayRes] = await Promise.all([
        axios.get('http://localhost:3001/chartroute/data', {
          params: { startDate: todayStr, endDate: todayEndStr, groupBy: 'day' },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3001/chartroute/data', {
          params: { startDate: yesterdayStr, endDate: yesterdayEndStr, groupBy: 'day' },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const todayEnergy = todayRes.data.data.reduce((sum, item) => sum + parseFloat(item.total), 0);
      const yesterdayEnergy = yesterdayRes.data.data.reduce((sum, item) => sum + parseFloat(item.total), 0);

      const hoursInDay = 24;
      const todayPower = todayEnergy / hoursInDay;
      const yesterdayPower = yesterdayEnergy / hoursInDay;

      setTodayVsYesterday({
        today: { power: todayPower },
        yesterday: { power: yesterdayPower },
      });
    } catch (error) {
      console.error('Error fetching today vs yesterday data:', error.response?.data || error.message);
      setTodayVsYesterday({
        today: { power: 0 },
        yesterday: { power: 0 },
      });
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchTodayVsYesterday();
  }, [groupBy, startDate, endDate]);

  const handleDateChange = (e, type) => {
    const val = e.target.value;
    if (type === 'start') setStartDate(val);
    else setEndDate(val);
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="filter-bar">
            <div className="date-filter">
              <label>
                From: <input type="date" value={startDate} onChange={e => handleDateChange(e, 'start')} />
              </label>
              <label>
                To: <input type="date" value={endDate} onChange={e => handleDateChange(e, 'end')} />
              </label>
            </div>
            <div className="range-buttons">
              <button className={groupBy === 'day' ? 'active' : ''} onClick={() => setGroupBy('day')}>
                Daily
              </button>
              <button className={groupBy === 'month' ? 'active' : ''} onClick={() => setGroupBy('month')}>
                Monthly
              </button>
              <button className={groupBy === 'year' ? 'active' : ''} onClick={() => setGroupBy('year')} disabled={startDate === '' || endDate === ''}>
                Yearly
              </button>
            </div>
          </div>

          {chartData.labels.length === 0 ? (
            <div>No data available for the selected period. Please adjust the filters or add machine data.</div>
          ) : (
            <>
              <div className="row first-row">
                <div className="large-card" id="card">
                  <h3 className="card-title">Power Consumption (Bar Chart)</h3>
                  <BarChart
                    xAxis={[{
                      scaleType: 'band',
                      data: chartData.labels,
                      tickLabelStyle: { fill: '#ffffff' },
                    }]}
                    yAxis={[{ tickLabelStyle: { fill: '#ffffff' } }]}
                    series={[{
                      data: chartData.powerData,
                      label: 'Power (kWh)',
                      color: '#1976d2',
                    }]}
                    width={400}
                    height={250}
                  />
                </div>

                <div className="large-card" id="card">
                  <h3 className="card-title">Power Over Time (Line Chart)</h3>
                  <LineChart
                    xAxis={[{
                      scaleType: 'band',
                      data: chartData.labels,
                      tickLabelStyle: { fill: '#ffffff' },
                    }]}
                    yAxis={[{ tickLabelStyle: { fill: '#ffffff' } }]}
                    series={[{
                      data: chartData.powerData,
                      label: 'Power (kWh)',
                      color: '#0077cc',
                    }]}
                    width={400}
                    height={250}
                  />
                </div>
              </div>

              <div className="row second-row">
                <div className="small-card" id="card">
                  <h3 className="card-title">Usage Meter (Gauge)</h3>
                  <GaugeChart
                    id="gauge-chart1"
                    nrOfLevels={40}
                    percent={(summary.totalPower / fullCapacity) / (maxPercentage / 100)}
                    colors={['#4FD1C5', '#F6AD55', '#FC8181']}
                    arcWidth={0.4}
                    textColor="#fff"
                  />
                  <div className="usage-label" style={{ color: '#fff', textAlign: 'center', marginTop: '10px' }}>
                    {`Usage: ${((summary.totalPower / fullCapacity) * 100).toFixed(1)}%`}
                  </div>
                </div>

                <div className="small-card" id="card">
                  <h3 className="card-title">Usage Summary</h3>
                  <table className="summary-table">
                    <tbody>
                      <tr>
                        <th className="label">Total Power Usage</th>
                        <td className="value">{summary.totalPower.toFixed(2)} kWh</td>
                      </tr>
                      <tr>
                        <th className="label">Total Usage Time</th>
                        <td className="value">{summary.usageTimeInHours.toFixed(2)} hours</td>
                      </tr>
                      <tr>
                        <th className="label">Sum of Usages</th>
                        <td className="value">{summary.totalPower.toFixed(2)} kWh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="small-card" id="card">
                  <h3 className="card-title">Today vs Yesterday</h3>
                  <table className="summary-table" id="table2">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Yesterday</th>
                        <th>Today</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Average Power</th>
                        <td>{todayVsYesterday.yesterday.power.toFixed(2)} kWh</td>
                        <td>{todayVsYesterday.today.power.toFixed(2)} kWh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;