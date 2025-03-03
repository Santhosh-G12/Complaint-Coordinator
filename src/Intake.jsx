
import './App.css';
import { useState} from "react"
import eventtype from "./product_event_map.json"
import LinearProgress from '@mui/material/LinearProgress';
import { Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types'


function  Intake({asReportedcode,setasReportedcode,selectedproduct,setselectedproduct}) {
  const apiKey = '031a052329241fa8365571d6e816ab01824905f89adac9875c66f54d858e5283'
  
  const [initial_info , setinitial_info] = useState("")
  const [Output,setOutput] =useState({})
  const [loading, setloading] =useState(false)
  const [filteredevent_types , setfilteredevent_types] = useState({})


  const hitter = async()=>{
    setloading(true)
    const prompt = `Extract the following information from the complaint description below and return ONLY a valid JSON object. Do NOT include any additional text, explanations, or formatting (e.g., Markdown backticks, unexpected tokens). Use the exact structure and default values provided below:

Additional Guidelines:
Understand the complaint in depth to avoid misinterpretation, as errors may cause serious problems for our team.
Identify as many distinct issues as possible from the complaint description.
Map each reported issue ONLY to the predefined codes listed in the Filtered Event Types. Do not create or assume new codes. If no exact match is found, return "NA".
Ensure the Reported Issue field clearly separates distinct issues into numbered points.

JSON Output Structure:
{
"Material": "Extract the material number or product code. If no information is found, return 'Unknown'.",
"Lot": "Extract the batch or lot number. If no information is found, return 'Unknown'.",
"Reported Issue": "Summarize each issue reported by the customer as a numbered list. If multiple issues are mentioned, clearly separate them into distinct points.",
"Patient Harm": "Indicate whether there was any harm to the patient or healthcare professional. If yes, provide details. If no harm is mentioned, return 'No harm reported.'",
"Date of Event": "Extract the date of the incident in MM/DD/YYYY format. If no date is found, return 'Unknown'.",
"Sample Information": "Indicate whether a sample is available for investigation. If yes, include any relevant details. If no information is found, return 'Unknown'.",
"Follow-up Questions": ["Generate a list of follow-up questions to gather additional information."],
"No of issues": "Count the number of distinct issues stated in the 'Reported Issue' field. Return the exact count as a number (e.g., 1, 2, 3). If no issues are mentioned, return 0.",
"Email id": "Extract the email address mentioned for further communication. If no email is found, return 'Unknown'.",
"Explanation": "Provide a detailed explanation of the reported issue(s) based on the complaint description.",
"Mapped Codes": "Map the reported issues ONLY to the predefined codes in the Filtered Event Types. Do not make assumptions or create new codes. If no match is found, return an empty array."
}

Inputs:
Selected Product: ${selectedproduct}
FilteredEventTypes:${filteredevent_types}
Complaint Description: ${initial_info}

Example Output:
{
"Material": "XYZ123",
"Lot": "BATCH456",
"Reported Issue": [
"1. Leakage occurred at the connection site.",
"2. The syringe tip cap was difficult to remove."
],
"Patient Harm": "No harm reported.",
"Date of Event": "01/15/2023",
"Sample Information": "Sample available for investigation.",
"Follow-up Questions": [
"Can you provide more details about the leakage?",
"Was the syringe used according to instructions?"
],
"No of issues": 2,
"Email id": "user@example.com ",
"Explanation": "The customer reported leakage at the connection site and difficulty removing the tip cap.",
"Mapped Codes": [
"LEAKAGE AT CONNECTION SITE",
"TIP CAP/SHIELD DIFFICULT OR CANNOT BE REMOVED"
]
} 
`;

    try{
      const response = await fetch("https://api.together.ai/v1/chat/completions",{
        method :"POST",
        headers :{
          "content-type" : "application/json",
          Authorization : `Bearer ${apiKey}`
        },
        body : JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          messages: [{role : "user",content :prompt}],
          max_tokens: 1000,
        })
      })
      if(!response.ok){
        throw new Error (`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const parseddata = JSON.parse(aiResponse)
      setOutput(parseddata)
      const finded_codes = parseddata["Mapped Codes"] || []
      setasReportedcode(finded_codes)
      console.log(`Sending the selected product ${selectedproduct}`)
      console.log(`Sending the codes ${asReportedcode}`)
      
    }
    catch(error){
      console.error(`we are facing an ${error.message}`)
     
      return null
    }finally{
      setloading(false)
    }
  }
  const mapper = ()=>{
    const filtered = eventtype[selectedproduct] || []
    setfilteredevent_types(filtered)
    
  }

  
  return (
    
    <div className='w-full h-full flex flex-col bg-black text-white'>
      <h1 className="text-2xl text-blue-500 w-full bg-blue-400 h-12 ">TrackX</h1>
      {loading?<LinearProgress/>:""}
      
    
      <div className="border border-gray-300 flex flex-col m-8 lg:m-12 p-2 gap-4  ">
        <label className="text-xl text-blue-500 font-bold ">Initial information</label>
        <textarea className = "border border-gray-200 outline-none p-2 text-black"
        onChange={(e)=>setinitial_info(e.target.value)}
        value={initial_info}
        placeholder="Enter your complaint information"
        />
      <div className="buttons flex gap-3 ">
        <button className ="bg-blue-400 h-14 w-28 font-bold rounded-2xl p-2 text-lg" onClick={hitter}>
          {loading?<CircularProgress/>:"Submit"}
          
          </button>
      
        <button className="bg-slate-300 h-14 w-28 font-bold rounded-2xl p-2 text-lg" >Clear</button>
      </div>
      <div className='text-white'>
        <select  className = "bg-black" onChange ={(e)=>setselectedproduct(e.target.value)} value={selectedproduct}>
          <option>ISD 1 - Alaris</option>
          <option>ISD 2 - Disposable</option>
          <option  value="CPR-130-MDS-001 - Injection Systems: Hypodermic (2 pc, 3pc, Emerald Syringes)">MDS 1 - Hypodermic (2 pc, 3pc, Emerald Syringes)</option>
          <option value="CPR-130-MDS-002 - Injection Systems: Hypodermic (Safety Syringes / Needles)">MDS 2 - Hypodermic (Safety Syringes / Needles)</option>
          <option value="CPR-130-MDS-003 - Injection Systems: Hypodermic (Orals, Enteral, Tip Caps)">MDS 3 - Hypodermic (Orals, Enteral, Tip Caps)</option>
          <option value="CPR-130-MDS-004 - Injection Systems: Hypodermic (Needles)">MDS 4 - Hypodermic (Needles)</option>
          <option value="CPR-130-MDS-004 - Injection Systems: Hypodermic (Needles)">MDS 5 - Sharps Collectors</option>
          <option value="CPR-130-MDS-004 - Injection Systems: Hypodermic (Needles)">MDS 6 - Sharps Accessories (Brackets, Cabinets, Stabilizers, Trolley)</option>
          <option value="CPR-130-MDS-007 - Anesthesia Needles - Spinal, Specialty, Introducer">Anesthesia Needles - Spinal, Specialty, Introducer</option>
          <option value="CPR-130-MDS-008 - Anesthesia Trays & Kit CSE, Epidural, Nerve Block, Pudendal Spinal, Support">MDS 8 - Anesthesia Trays & Kit CSE, Epidural, Nerve Block, Pudendal Spinal, Support</option>
          <option value="CPR-130-MDS-009 - Anesthesia Syringes - Epilor, Glass Lor">MDS 9 - Anesthesia Syringes - Epilor, Glass Lor</option>
          <option value="CPR-130-MDS-010 - Anesthesia Misc. - Catheters, Connectors, Accessories">MDS 10 - Anesthesia Misc. - Catheters, Connectors, Accessories</option>
          <option value="CPR-130-MDS-011 - PhaSeal: Connectors">MDS 11 - PhaSeal: Connectors</option>
          <option value="CPR-130-MDS-012 - PhaSeal: Protector">MDS 12 - PhaSeal: Protector</option>
          <option value="CPR-130-MDS-013 - PhaSeal: Injector">MDS 13 - PhaSeal: Injector</option>
          <option value="CPR-130-MDS-014 - Infusion Adapters">MDS 14 - Infusion Adapters</option>
          <option value="CPR-130-MDS-015 - PhaSeal: Accessories">MDS 15 - PhaSeal: Accessories</option>
          <option value="CPR-130-MDS-016 - PIVC: Conventional Catheters Non Ported - Insyte, Angiocath, Neoflon, Intima II">PIVC: Conventional Catheters Non Ported - Insyte, Angiocath, Neoflon, Intima II</option>
          <option value="CPR-130-MDS-017 - PIVC: Conventional Catheters Ported - Venflon, Venflon I, Venflon Pro">MDS 17 - PIVC: Conventional Catheters Ported - Venflon, Venflon I, Venflon Pro</option>
          <option value="CPR-130-MDS-019 - PIVC: Arterial Cannula">MDS 19 - PPIVC: Arterial Cannula</option>
          <option value="CPR-130-MDS-020 - PIVC: Insyte-A">MDS 20 - PIVC: Insyte-A</option>
          <option value="CPR-130-MDS-021 - PIVC - Insyte Autoguard & Angio Autoguard">MDS 21 - PPIVC - Insyte Autoguard & Angio Autoguard</option>
          <option value="CPR-130-MDS-022 - PIVC - Insyte Autoguard BC">MDS 22 - PIVC - Insyte Autoguard BC</option>
          <option value="CPR-130-MDS-023 - PIVC - Venflon Pro Safety">MDS 23 - PIVC - Venflon Pro Safety</option>
          <option value="CPR-130-MDS-024 - PIVC - Introsyte">MDS 24 - PIVC - Introsyte</option>
          <option value="CPR-130-MDS-025 - PIVC - Introsyte Autoguard">MDS 25 - Introsyte Autoguard</option>
          <option value="CPR-130-MDS-026 - PIVC - Cathena">MDS 26 - PIVC - Cathena</option>
          <option value="CPR-130-MDS-027 - PIVC - Nexiva">MDS 27 - PIVC - Nexiva</option>
          <option value="CPR-130-MDS-028 - PIVC - SAF-T-INTIMA">MDS 28 - PIVC - SAF-T-INTIMA</option>
          <option value="CPR-130-MDS-029 - PIVC - Nexiva Diffusics">MDS 29 - PIVC - Nexiva Diffusics</option>
          <option value="CPR-130-MDS-030 - PIVC - PEGASUS">MDS 30 - PIVC - PEGASUS</option>
          <option value="CPR-130-MDS-031 - Catheter Care - Prefilled & Locking Syringes">MDS 31 - atheter Care - Prefilled & Locking Syringes</option>
        </select>
        <Button onClick={mapper}>ok</Button>
      </div>
      
      <label className="text-xl text-blue-500 font-bold">Output</label>

     
      <div className='flex gap-3 flex-wrap' >
        
        <div>
          {Object.entries(Output).map(([field,value],index)=>{
            return Array.isArray(value)?(
              <div  className="order">
                <h1>{field}</h1>
                  {value.map((unique,idx)=>(
                    <div key={idx} className="orders">
                      
                      <p>{unique}</p>
                    </div>
                  ))}
              </div>
            ):(
              <div key= {index} className="div">
                <h1>{field}</h1>
                <p>{value}</p>
              </div>
            );
            
})}
        
      <p>Hi</p>
      <p>{asReportedcode}</p>
        </div>
        
        
      </div>
    </div>
 </div>  
  )
}
Intake.propTypes = {
  asReportedcode : PropTypes.array.isRequired,
  setasReportedcode : PropTypes.func.isRequired,
  selectedproduct : PropTypes.string.isRequired,
  setselectedproduct : PropTypes.string.isRequired
}
export default Intake;
