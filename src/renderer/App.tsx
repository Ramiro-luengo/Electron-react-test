import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import icon from '../../assets/icon.svg';
import Tables from './components/tableView/tables';
import EditTables from './components/editTables';
import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Center">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <div className="Center">
        <Link to="/tables">
          <button className="button" type="button">
            Tables view
          </button>
        </Link>
        <Link to="/edit">
          <button className="button" type="button">
            Tables edit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/edit" element={<EditTables />} />
      </Routes>
    </Router>
  );
}
