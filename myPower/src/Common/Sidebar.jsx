import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  ToolOutlined 
} from '@ant-design/icons';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="menu">
        <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
          <DashboardOutlined className="icon" />
          <span className="menu-text">Dashboard</span>
        </Link>
        <Link to="/AddMachine" className={`menu-item ${location.pathname === '/machines' ? 'active' : ''}`}>
          <ToolOutlined className="icon" />
          <span className="menu-text">Machines</span>
        </Link>
        <Link to="/Report" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`}>
          <ThunderboltOutlined className="icon" />
          <span className="menu-text">Reports</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
