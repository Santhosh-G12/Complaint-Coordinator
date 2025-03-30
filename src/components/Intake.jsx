
import '../App.jsx';
import { useContext, useState, useEffect } from "react"
import eventtype from "../product_event_map.json"
import CPR from '../NEW.json'
import LinearProgress from '@mui/material/LinearProgress';
import { Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types'
import { AppContext } from '../App.jsx';
import NewEvents from '../NewEvents.json'
import Master from '../Master.json'



function Intake() {

  const apiKey = '031a052329241fa8365571d6e816ab01824905f89adac9875c66f54d858e5283'
  const { asReportedcode, setasReportedcode, selectedproduct, setselectedproduct, initial_info, setinitial_info, Output, setOutput, isNewversion, setisNewversion } = useContext(AppContext)
  const [loading, setloading] = useState(false)
  const [filteredevent_types, setfilteredevent_types] = useState({})
  const [Acode, setAcode] = useState([])
  const [source, setSource] = useState(Master)
  const [materialGrid, setmaterialGrid] = useState([])

  useEffect(() => {
    if (!isNewversion) {
      setSource(() => CPR)
    }
  }, [isNewversion])



  useEffect(() => {
    if (selectedproduct) {
      setselectedproduct(selectedproduct)
      console.log(selectedproduct)
      if (isNewversion === true) {
        const filtered = NewEvents[selectedproduct]
        setfilteredevent_types(filtered)
        console.log(filtered)
        return
      }
      const filtered = eventtype[selectedproduct]
      setfilteredevent_types(filtered)
      console.log(filtered)


    }
  }, [selectedproduct])

  useEffect(() => {
    if (asReportedcode.length > 0) {
      if (!source || !selectedproduct) return
      setAcode([])
      const acodeArray = []
      const x = source[selectedproduct]
      if (!x) {
        console.error("undefined")
        return
      }
      for (const code of asReportedcode) {
        const y = x[code]
        if (!y) {
          console.warn(`${code} is not found`)
          continue
        }

        const z = y["A CODE"]
        if (z === undefined) {
          console.warn("A code not found")
          continue
        }
        acodeArray.push(z)

      }
      setAcode(acodeArray)
      console.log(Acode)
    }

  }, [asReportedcode])


  //Process of Retriving As Reported code 
  function handleARcode() {
    let res = []
    
    for (const code of asReportedcode) {
    

      const arCode = Master[selectedproduct][code]["As Reported/As Analyzed Code 1"]
      const ascode = Master[selectedproduct][code]["IMDRF Annex A (Problem) Code & Definition"]
      
      let rese = {
        "dtcode" : code,
        "arcode": arCode,
        "ascode": ascode
      }
      res.push(rese)}
    setmaterialGrid(res)
    console.log(materialGrid)
  }










  const hitter = async () => {
    setloading(true)
    const prompt = `Extract the following information from the complaint description below and return
  ONLY a valid JSON object. Do NOT include any additional text, explanations, or formatting (e.g., Markdown backticks, unexpected tokens). Use the exact structure and default values provided below:

Additional Guidelines:
Understand the complaint in depth to avoid misinterpretation, as errors may cause serious problems for our team.
Identify as many distinct issues as possible from the complaint description.
Map each reported issue ONLY to the predefined codes listed in the Filtered Event Types. Do not create or assume new codes. If no exact match is found, return "NA".
Ensure the Reported Issue field clearly separates distinct issues into numbered points.

JSON Output Structure:
{
"Material": "Extract the material number or product code. If no information is found, return 'Unknown'.",
"Lot": "Extract the batch or lot number. If no information is found, return 'Unknown'.",
"Date of Event": Extract the date of the incident from the provided text. The date should be in MM/DD/YYYY format. If the date is incomplete or informal (e.g., '12-5'), interpret it as best as possible based on the context (e.g., '12-5' could mean 12/05/YYYY). If no year is specified, assume the current year. If the text mentions 'today' or 'yesterday', calculate the corresponding date based on the current date. If no valid date can be determined, return 'Unknown'.",
"Sample Information": "Determine whether a sample is available for investigation based on the provided information. If the complaint explicitly mentions that the product was thrown away, discarded, disposed of, destroyed, given away, returned, lost, or otherwise made inaccessible, return 'No sample available due to disposal.' If the customer uses phrases indicating the product has been retained (e.g., 'saved the product,' 'kept the product,' 'set aside the product,' 'sequestered the product,' 'preserved the product,' 'stored the product,' 'retained the product,' 'kept it for testing,' 'put it away'), return 'Sample available for investigation.' If there is no clear indication of sample availability or disposal, return 'Unknown.",
"Entry Description": "Format this field as: 'Material : [found material number or 'Unknown']       Batch : [found batch number or 'Unknown'] It was reported by the customer that the [rephrased reported issue].' Ensure consistent spacing.",
"No of issues": "Count the number of distinct issues stated in the 'Reported Issue' field. Return the exact count as a number (e.g., 1, 2, 3). If no issues are mentioned, return 0.",
"Email id": "Extract the email address mentioned for further communication. If no email is found, return 'Unknown'.",
"Reported Issue": "Summarize each issue reported by the customer as a numbered list. If multiple issues are mentioned, clearly separate them into distinct points.",
"Patient Harm": "Indicate whether there was any harm to the patient or healthcare professional. If yes, provide details. If no harm is mentioned, return 'No harm reported.'",
"Follow-up Questions": ["Generate a list of follow-up questions to gather additional information."],
"Explanation": "Help me to understand the complaint in depth as much as possible that help me to understad the issue btter . Give me indepth explaintion .",
"Mapped Codes": "Map the reported issues ONLY to the exact predefined codes listed in the Filtered Event Types. Do not assume, infer, or create new codes under any circumstances. If no match is found between the reported issue and the predefined codes, return an empty array ([]). Ensure that all mappings are case-sensitive and match the predefined codes exactly as they appear in the Filtered Event Types list.}

Inputs:

FilteredEventTypes:${filteredevent_types}
Complaint Description: ${initial_info}

Example Output:
{
"Material": "ME2010",
"Lot": "Unknown",
"Date of Event": "Unknown",
"Sample Information": "Unknown",
"No of issues": 2,
"Email id": "Unknown",
"Patient Harm": "No harm reported.",
"Entry Description": "Material : ME2010       Batch : Unknown It was reported by the customer that the tubing gets stuck when connected to an IV or t-piece set and can break off completely when being removed.",
"Reported Issue": [
"1. The tubing gets stuck when connected to an IV or t-piece set.",
"2. The tubing can break off completely when being removed."
],
"Follow-up Questions": [
"Can you confirm the date of the event?",
"Was there any harm to the patient or healthcare professional?",
"Is a sample available for investigation?"
],


"Explanation": "Please help me deeply understand the complaint or issue by providing a comprehensive explanation. Include the emotional and contextual aspects to give me a clearer sense of the situation. Break down any medical or technical terms used, offering simple definitions or analogies to ensure I fully grasp their meaning. Walk me through the details step by step, explaining the root cause, implications, and any related nuances. The goal is to leave no ambiguity and ensure I have a complete understanding of the problem—both its surface-level and underlying layers.",
"Mapped Codes": [
"TUBING STUCK WHEN CONNECTED TO IV OR T-PIECE SET",
"TUBING BREAKS OFF COMPLETELY WHEN REMOVED"
]
}     
`;

    try {
      const response = await fetch("https://api.together.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        })
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const parseddata = JSON.parse(aiResponse)
      setOutput(parseddata)
      const finded_codes = parseddata["Mapped Codes"] || []
      setasReportedcode(finded_codes)
      console.log(`Sending the selected product ${selectedproduct}`)
      console.log(`Sending the codes ${asReportedcode}`)
      console.log(Output)

    }
    catch (error) {
      console.error(`we are facing an ${error.message}`)

      return null
    } finally {
      setloading(false)
    }
  }

  function clear() {
    setOutput('')
    setinitial_info('')
  }



  return (



    <div className='w-full min-h-screen flex flex-col bg-black text-white '>

      {loading ? <LinearProgress /> : ""}

      {/* Input Field */}
      <section className="  flex flex-col md:flex-row  lg:flex-row justify-start lg:m-12   bg-black rounded-lg border border-gray-800 p-6 ">
        <label className="text-2xl text-blue-500 font-medium ">Initial information</label>
        <textarea className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-200 placeholder-gray-500 resize-y transition-colors duration-200"
          onChange={(e) => setinitial_info(e.target.value)}
          value={initial_info}
          placeholder="Enter your complaint information"
        />

        <div className='text-white font-medium '>
          {!isNewversion ?
            <div>
              <label htmlFor="dropdown" className='text-2xl text-blue-500 font-medium'>Affected Product</label>
              <select id='dropdown' className="bg-black font-bold text-xl focus:border overflow-hidden w-full" onChange={(e) => setselectedproduct(e.target.value)} value={selectedproduct}>
                <option >Select your Product</option>
                <option value="CPR-130-ISD-001 - Alaris and Gemini Infusion Sets">ISD 1 - Alaris</option>
                <option value="CPR-130-ISD-002 - Extension Sets">ISD 2 - Extenstion sets</option>
                <option value="CPR-130-MDS-001 - Injection Systems: Hypodermic (2 pc, 3pc, Emerald Syringes)">MDS 1 - Hypodermic (2 pc, 3pc, Emerald Syringes)</option>
                <option value="CPR-130-MDS-002 - Injection Systems: Hypodermic (Safety Syringes / Needles)">MDS 2 - Hypodermic (Safety Syringes / Needles)</option>
                <option value="CPR-130-MDS-003 - Injection Systems: Hypodermic (Orals, Enteral, Tip Caps)">MDS 3 - Hypodermic (Orals, Enteral, Tip Caps)</option>
                <option value="CPR-130-MDS-004 - Injection Systems: Hypodermic (Needles)">MDS 4 - Hypodermic (Needles)</option>
                <option value="CPR-130-MDS-005 - Sharps Collectors">MDS 5 - Sharps Collectors</option>
                <option value="CPR-130-MDS-006 - Sharps Accessories (Brackets, Cabinets, Stabilizers, Trolley)">MDS 6 - Sharps Accessories (Brackets, Cabinets, Stabilizers, Trolley)</option>
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
                <option value="CPR-130-MDS-031 - Catheter Care - Prefilled & Locking Syringes">MDS 31 - Catheter Care - Prefilled & Locking Syringes</option>
              </select>
            </div>
            :
            <div>
              <label htmlFor='new-dropdown' className='text-2xl text-blue-500 font-medium'></label>
              <select id="dropdown" className="bg-black font-bold text-xl focus:border overflow-hidden w-full" value={selectedproduct} onChange={(e) => setselectedproduct(e.target.value)}>
                <option value="Hypodermic">Hypodermic</option>
                <option value="Anesthesia">Anesthesia</option>
                <option value="Sharps">Sharps</option>
                <option value="Flush Syringes">Flush Syringes</option>
                <option value="PIVC">PIVC</option>
                <option value="CPR-130-ISD-001 - Alaris and Gemini Infusion Sets">Alaris/Gemini</option>
                <option value="CPR-130-ISD-002 - Extension Sets">Extension sets</option>
              </select>
            </div>
          }


        </div>
        <div className="buttons flex gap-3 ">
          <button className={initial_info ? "px-4 py-1 bg-blue-700 hover:bg-blue-600 text-gray-100 rounded-md text-sm transition-colors duration-200" : "px-4 py-1 bg-[#cccccc] bg-opacity-70 text-[#666666] cursor-not-allowed"} disabled={initial_info ? false : true} onClick={hitter}>
            {loading ? <CircularProgress /> : "Submit"}

          </button>

          <button onClick={clear} className="bg-300 h-14 w-28 font-bold rounded-2xl p-2 text-lg" >Clear</button>
          <button onClick={() => setisNewversion(prev => !prev)}>Change</button>
        </div>
      </section>

      {/* Results Fields*/}
      <section className=' resuls text-xl  text-gray-100 m-11 font-medium border border-gray-900' >

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12  '>
          {Object.entries(Output).map(([field, value], index) => {
            return Array.isArray(value) ? (
              <div className="bg-transparent rounded-lg overflow-hidden shadow divide-y divide-gray-700  ">

                <div className="px-4 py-4 bg-blue-500 border-blue-500 text-blue-400   rounded-lg bg-opacity-25 text-xl  ">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </div>
                {field === "Mapped Codes" ? (
                  value.map((unique, idx) => {
                    if (unique)
                      return (
                        <div key={idx} className=" flex justify-between">

                          <h1 className='py-2 px-3 text-gray-300 font-medium  '>{unique}</h1>
                          <button onClick={() => handleARcode} className='bg-red-500 rounded-lg mr-2 w-11 h-full m-2 font-medium'>Edit</button>

                        </div>)

                  })

                ) : (
                  value.map((unique, idx) => (
                    <div key={idx} className=" ">

                      <p className=' py-2 px-3 text-gray-300  '>{unique}</p>
                    </div>
                  ))

                )}
              </div>
            ) : (
              <div key={index} className="bg-tranparent rounded-lg overflow-hidden shadow ">
                <div className="px-4 py-4 bg-blue-500 border-blue-500 text-blue-400   rounded-lg bg-opacity-25 text-xl divide-y divide-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </div>
                <p className='py-2 px-3 text-gray-300 '>{value}</p>
              </div>
            );



          })}
          {
            Acode.length > 0 && (
              <div className=" flex flex-col gap-3">
                <h1 className='text-xl font-extrabold text-blue-600'>A codes</h1>
                {Acode.map((code, index) => (
                  <div key={index} className="bg-gray-800  flex px-2 py-2 font-mono font-bold">
                    <h1>{code}</h1>
                  </div>
                ))}
              </div>
            )
          }


        </div>
        <div>
          <button onClick={handleARcode}>Click</button>
          <h1>Hi</h1>
        </div>
        {materialGrid.length>0 &&(
          <div>
          <table className='border w-full justify-between'>
            {/*Table Header */}
            <thead className='w-full tracking-wide text-blue-500  '>
              <tr >
                <th className='border'>Event</th>
                <th className='border'>Code</th>
                <th className='border'>AsReportedcode</th>
                <th className='border'>A code</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className='w-full'>
              {materialGrid.map((code,index)=>(
                 <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{index+1}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.dtcode}<button className='border px-4 bg-red-600'>Edit</button></td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.ascode}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.arcode}</td>
               </tr>
              ))}
             
            
            </tbody>

          </table>
        </div>
        )}
        

      </section >
    </div>

  )
}
Intake.propTypes = {
  asReportedcode: PropTypes.array.isRequired,
  setasReportedcode: PropTypes.func.isRequired,
  selectedproduct: PropTypes.string.isRequired,
  setselectedproduct: PropTypes.string.isRequired,
  initial_info: PropTypes.string.isRequired,
  setinitial_info: PropTypes.func.isRequired,
  Output: PropTypes.object.isRequired,
  setOutput: PropTypes.func.isRequired
}
export default Intake;
