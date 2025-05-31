import React, { useEffect, useState } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './report.css';

const { Option } = Select;

const Report = () => {
  const [appliances, setAppliances] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const loadAppliances = async () => {
      try {
        const response = await fetch();
        const data = await response.json();
        setAppliances(data);
      } catch (error) {
        console.error('Error fetching appliances:', error);
      }
    };
    loadAppliances();
  }, []);

  useEffect(() => {
    const loadTableData = async () => {
      try {
        const response = await fetch();
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    loadTableData();
  }, [searchQuery, selectedAppliance]);

  return (
    <div className="report-container">
        <div className="Rep">Reports</div>
      <div className="report-controls">
        <Input
          className="report-search"
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          className="report-dropdown"
          value={selectedAppliance}
          onChange={(value) => setSelectedAppliance(value)}
          placeholder="Select Appliance">
          <Option value="">All Appliances</Option>
          {appliances.map((appliance) => (
            <Option key={appliance.id} value={appliance.name}>
              {appliance.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="report-table" >
        <table className="table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Machine Name</th>
              <th>KW</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.kw}</td>
                  <td>{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
  <td colSpan={4}>
    <div className="no-data-ui">
      <SearchOutlined className="no-data-icon" />
      <p>No data found for the selected filters.</p>
    </div>
  </td>
</tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
