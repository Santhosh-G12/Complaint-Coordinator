// App.jsx
import { createContext, useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Intake from './components/Intake.jsx';
import DT from './components/DT.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';

// Create the Context
export const AppContext = createContext();

// Provide the App Context
export function AppProvider({ children }) {
  console.log('AppProvider Mounted');

  const [asReportedcode, setasReportedcode] = useState([]);
  const [selectedproduct, setselectedproduct] = useState('');

  const values = {
    asReportedcode,
    setasReportedcode,
    selectedproduct,
    setselectedproduct
  }

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

// Persistent Layout Component

// Main App Component
function App() {
  return (
    <BrowserRouter>
   
        <nav>
          <Link to="/" className="bg-blue-500">Home</Link>
          <Link to="/Intake" className="bg-red-200">Intake</Link>
          <Link to="/DT" className="bg-red-200">DT</Link>
        </nav>
        <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="Intake" element={<Intake />} />
            <Route path="DT" element={<DT />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;