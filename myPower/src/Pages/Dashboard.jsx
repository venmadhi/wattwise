import React, { useState } from "react";
import "./dashboard.css";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import GaugeChart from "react-gauge-chart";

const Dashboard = () => {
  const [range, setRange] = useState("daily");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const powerData = [120, 90, 100, 140, 110, 80, 70];
  const timeData = [3, 2.5, 3.5, 4, 3, 2, 2.5];

  const totalPower = powerData.reduce((sum, val) => sum + val, 0);
  const totalTime = timeData.reduce((sum, val) => sum + val, 0);
  const totalUsage = powerData.reduce(
    (acc, val, index) => acc + val * timeData[index],
    0
  );

  return (
    <div className="dashboard-container">
      <div className="filter-bar">
        <div className="date-filter">
          <label>
            From: <input type="date" />
          </label>
          <label>
            To: <input type="date" />
          </label>
        </div>
        <div className="range-buttons">
          <button
            className={range === "daily" ? "active" : ""}
            onClick={() => setRange("daily")}
          >
            Daily
          </button>
          <button
            className={range === "weekly" ? "active" : ""}
            onClick={() => setRange("weekly")}
          >
            Weekly
          </button>
          <button
            className={range === "monthly" ? "active" : ""}
            onClick={() => setRange("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="row first-row">
        <div className="large-card" id="card">
          <h3 className="card-title">Power Consumption (Bar Chart)</h3>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: days,
                tickLabelStyle: { fill: "#ffffff" }, 
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: "#ffffff" },
              },
            ]}
            series={[
              {
                data: powerData,
                label: "Power (kWh)",
                color: "#1976d2",
                textColor: "#fff",
              },
            ]}
            width={400}
            height={250}
          />
        </div>

        <div className="large-card" id="card">
          <h3 className="card-title">Power Over Time (Line Chart)</h3>
          <LineChart
            xAxis={[
              {
                scaleType: "band",
                data: days,
                tickLabelStyle: { fill: "#ffffff" },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: "#ffffff" },
              },
            ]}
            series={[
              { data: powerData, label: "Power (kWh)", color: "#0077cc" },
            ]}
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
            nrOfLevels={20}
            percent={totalPower / 700}
            colors={["#4FD1C5", "#F6AD55", "#FC8181"]}
            arcWidth={0.4}
            textColor="#fff"
          />
        </div>

        <div className="small-card" id="card">
          <h3 className="card-title">Weekly Usage Summary</h3>
          <table className="summary-table">
            <tbody>
              <tr>
                <th className="label">Total Power Usage</th>
                <td className="value">{totalPower} kWh</td>
              </tr>
              <tr>
                <th className="label">Total Usage Time</th>
                <td className="value">{totalTime} hours</td>
              </tr>
              <tr>
                <th className="label">Sum of Usages</th>
                <td className="value">{totalUsage} kWh·hours</td>
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
                <td>102 kWh</td>
                <td>118 kWh</td>
              </tr>
              <tr>
                <th>Average Time</th>
                <td>2.8 hrs</td>
                <td>3.2 hrs</td>
              </tr>
              <tr>
                <th>Combined Usage</th>
                <td>285.6 kWh·hrs</td>
                <td>377.6 kWh·hrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
