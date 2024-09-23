
import './App.css';
import Login from './pages/login';
import UsersList from './pages/user';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Roles from './pages/roles';

function App() {
  return (
    <div className="flex column">
      <BrowserRouter>
        <Routes>
          <Route path="/users" element={<UsersList />} />
          <Route path="/" element={<Login />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
