import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartialResult from './components/PartialResult';
import Games from './components/Games';
import NavBar from './components/NavBar'
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter basename="/itdays">
        <Routes>
          <Route path="/" element={<PartialResult />} />
          <Route path="/games" element={<Games />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
