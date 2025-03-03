import PropTypes from "prop-types"
import { useState } from "react"
import CPR from './CPR.json'

const DT = ({asReportedcode,selectedproduct}) => {
    const [event_description, seteventdescription] = useState("")
    const [rep_rationale, setrep_rationale] = useState("")
    const [event_type, setevent_type] = useState("")
    const [reportable,setreportable] = useState(true)
    const [DT_rationale,setDT_rationale] = useState("")
    

    const load_DT = ()=>{

      const possible_events = CPR[selectedproduct]
      const asAnalysed_Event = possible_events[asReportedcode]
      const rep_rationale = asAnalysed_Event["Reportable Determination Rationale"]
      const reportable = asAnalysed_Event["Presumptively Reportable"]

      {
        if(reportable === "No"){
          setreportable(false)
        }
        setreportable(true)
      }
      const event_type = asReportedcode
      setevent_type(event_type)
      setrep_rationale(rep_rationale)
      
      
      
        const final_op =
        `
Description of the event/incident:
 
Verbatim: ${event_description}
 
Reportability Determination Rationale: ${rep_rationale}
 
${reportable?("This complaint is MDR reportable" ): ("This complaint is not MDR reportable. There was no report of serious injury, medical intervention, or reportable device malfunction"     
        )}
 
Event Type: ${event_type} 
        `
        setDT_rationale(final_op)
    }



  return (
    <div className = "w-full h-full flex flex-col bg-black text-white">
        <div className="border border-gray-300 flex flex-col m-8 lg:m-12 p-2 gap-4">
                <button onClick={load_DT}>Check</button>
                <h1>Paste  in DT</h1>
                <textarea className = "text-black h-[400px]" value={DT_rationale}></textarea>
        </div>
      
    </div>
  )
}
DT.propTypes = {
  asReportedcode : PropTypes.array.isRequired,
  selectedproduct : PropTypes.string.isRequired
}

export default DT
