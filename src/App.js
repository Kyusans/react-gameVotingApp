import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartialResult from './components/PartialResult';
import Games from './components/Games';
import NavBar from './components/NavBar'

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PartialResult />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
