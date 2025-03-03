
import Intake from './Intake.jsx'
import DT from './DT.jsx'
import { useState } from 'react'


function App() {
  const [asReportedcode,setasReportedcode] = useState([])
  const [selectedproduct, setselectedproduct] = useState("")
  return(
    <div>
      <Intake asReportedcode={asReportedcode} 
      setasReportedcode = {setasReportedcode} 
      selectedproduct={selectedproduct}
      setselectedproduct={setselectedproduct}/>

      <DT asReportedcode={asReportedcode}
      selectedproduct = {selectedproduct}
      />
    </div>
    
  )
}
export default App
