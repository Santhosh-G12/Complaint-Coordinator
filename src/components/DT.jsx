  import PropTypes from "prop-types"
  import { useState, useContext ,useEffect} from "react"
  import CPR from '../CPR.json'
  import { AppContext } from '../App.jsx';

  const DT = () => {
      console.log("Dt mounted") 
      useEffect(() => {
        console.log('Intake Component Mounted');
      }, []);
      const [event_description, seteventdescription] = useState("")
      const {asReportedcode,setasReportedcode,selectedproduct,setselectedproduct} = useContext(AppContext)
      const asAnalysed_Codes = asReportedcode
      const affected_product = selectedproduct
      const allDT = {}
      const [readymade_DT,setReadymade_DT] = useState([])


    const DT_Man = (asReportedcode, affected_product) =>{
      
      const possible_events = CPR[affected_product]
      for (const code of asReportedcode ){
      const seperate = possible_events[code]
  
        allDT[code] = {
          
        "Reportable Determination Rationale" : seperate["Reportable Determination Rationale"],
        "Presumptively Reportable" : seperate["Presumptively Reportable"]
        }
      console.log(allDT)
        
      }
      
      
    }

    {/*creating readymade_DT */}
      const load_DT = (allDT)=>{
      const readymade_DTs = []
      Object.entries(allDT).forEach(([code,value])=>{
        const rationale = value["Reportable Determination Rationale"]
        const isReportable = value["Presumptively Reportable"] === "Yes"

      
        const final_op =
        `
  Description of the event/incident:

  Verbatim: ${event_description}

  Reportability Determination Rationale: ${rationale}

  ${isReportable?("This complaint is MDR reportable" ): ("This complaint is not MDR reportable. There was no report of serious injury, medical intervention, or reportable device malfunction"     
        )}

  Event Type: ${code} 
        `
      readymade_DTs.push(final_op)   
      })
      setReadymade_DT((prev)=>[...prev,...readymade_DTs])
      console.log(readymade_DT)
    }
    const copyDT = (DTid) =>{
      const content = readymade_DT[DTid]
      navigator.clipboard.writeText(content)
      .then(()=>{
        alert("textcopied")
      })
    }
        
        
    
    return (
      <div className = "w-full h-full flex flex-col bg-black text-white">
          <div className="border-4 border-gray-300 flex flex-col m-8 lg:m-12 p-2 gap-4">
                  <button onClick={()=>DT_Man(asAnalysed_Codes,affected_product)}>Start</button>
                  <button onClick={()=>load_DT(allDT)}>DT</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {readymade_DT.map((DT,index)=>(
                    
                    <div key = {index} className=" m-4 flex flex-col shadow-lg shadow-yellow-400 rounded-lg border  hover:shadow-xl">
                      <h1 className="text-blue-600">DT {index}</h1>
                      
                      <button className="rounded-lg text-black bg-blue-600 hover:bg-blue-700 shadow-md transition-colors duration-300 m-3 " onClick ={()=>copyDT(index)}>Copy</button>
                      <textarea className = "w-full h-[400px] bg-gray-800 text-white border border-blue-600 rounded-lg p-4 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all duration-200 placeholder-gray-500"  value={DT}></textarea>
                    </div>
                  ))
                  } 
                  </div>
                    
          </div>
        
      </div>
    )
  }
  DT.propTypes = {
    asReportedcode : PropTypes.array.isRequired,
    selectedproduct : PropTypes.string.isRequired
  }

  export default DT
