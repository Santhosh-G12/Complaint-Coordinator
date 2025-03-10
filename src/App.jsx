import Intake from './components/Intake.jsx';
import DT from './components/DT.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

// Create the Context
const AppContext = createContext();

// Provide the App Context
function AppProvider({ children }) {
  console.log('AppProvider Mounted');
  const [asReportedcode, setasReportedcode] = useState([]);
  const [selectedproduct, setselectedproduct] = useState('');

  const values = {
    asReportedcode,
    setasReportedcode,
    selectedproduct,
    setselectedproduct,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };

// Persistent Layout Component
function Layout() {
  return (
    <>
      <nav>
        <Link to="/" className="bg-blue-500">Home</Link>
        <Link to="/Intake" className="bg-red-200">Intake</Link>
        <Link to="/DT" className="bg-red-200">DT</Link>
      </nav>
      <Outlet />
      <Footer />
    </>
  );
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Hero />} />
            <Route path="Intake" element={<Intake />} />
            <Route path="DT" element={<DT />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
