// App.jsx
import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link,  } from 'react-router-dom';
import Intake from './components/Intake.jsx';
import DT from './components/DT.jsx';
import Hero from './components/Hero.jsx';
import AI from './components/AI_Tool.jsx';


import Footer from './components/Footer.jsx';


// Create the Context
export const AppContext = createContext();

// Provide the App Context
export function AppProvider({ children }) {
  
 
//Varibles
  const [asReportedcode, setasReportedcode] = useState([])
  const [selectedproduct, setselectedproduct] = useState("")
  const [initial_info,setinitial_info] = useState("")
  const [Output,setOutput] = useState({})
  const [isNewversion,setisNewversion] = useState(true)
  
 

  const values = 
    {
      asReportedcode,
      setasReportedcode,
      selectedproduct,
      setselectedproduct,
      initial_info,
      setinitial_info,
      Output,
      setOutput,
      isNewversion,
      setisNewversion
    }
 

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
// Main App Component
function App() {
  const [selectedTab,setSelectedTab] = useState("Home")
  

  return (
    <BrowserRouter>
      <AppProvider>
        <nav className='flex font-medium w-full bg-black  gap-5 p-5 '>
            <Link onClick={()=>setSelectedTab("Home")} to="/" className={selectedTab==="Home"?" px-4 py-4 bg-blue-500 border-blue-500 text-blue-400 w-36 text-center border rounded-lg bg-opacity-25 text-xl  ":"px-4 py-4 w-36 text-center hover:text-blue-500 rounded-lg bg-opacity-25 text-xl text-white"}>Home</Link>
            <Link onClick={()=>setSelectedTab("Intake")} to="/Intake" className={selectedTab==="Intake"?" px-4 py-4 bg-blue-500 border-blue-500 text-blue-400 w-36 text-center border rounded-lg bg-opacity-25 text-xl  ":"px-4 py-4 w-36 text-center hover:text-blue-500 rounded-lg bg-opacity-25 text-xl text-white "}>Intake</Link>
            <Link onClick={()=>setSelectedTab("DT")} to="/DT" className={selectedTab==="DT"?" px-4 py-4 bg-blue-500 border-blue-500 text-blue-400 w-36 text-center border rounded-lg bg-opacity-25 text-xl  ":"px-4 py-4 w-36 text-center hover:text-blue-500 rounded-lg bg-opacity-25 text-xl text-white"} >DT</Link>
            <Link onClick={()=>setSelectedTab("AI")} to="/AI" className={selectedTab==="AI"?" px-4 py-4 bg-blue-500 border-blue-500 text-blue-400 w-36 text-center border rounded-lg bg-opacity-25 text-xl  ":"px-4 py-4 w-36 text-center hover:text-blue-500 rounded-lg bg-opacity-25 text-xl text-white"} >AI</Link>
          </nav> 
        
          <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="Intake" element={<Intake />} />
              <Route path="DT" element={<DT />} />
              <Route path="AI" element={<AI />} />
          </Routes>
      </AppProvider>
     
      
    </BrowserRouter>
  );
}

export default App;