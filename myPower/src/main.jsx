import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css';
import Dashboard from './Pages/Dashboard.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <App/>
  </StrictMode>,
)
