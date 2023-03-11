import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartialResult from './components/PartialResult';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PartialResult />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
