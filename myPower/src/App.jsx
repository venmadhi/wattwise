import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './MainLayout/Layout';
import Dashboard from './Pages/Dashboard';
import AddMachine from './Pages/AddMachine';
import Report from './Pages/Report';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="addmachine" element={<AddMachine />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
