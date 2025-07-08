
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
import { FileText, TriangleAlert, Package, CircleCheck, SearchIcon, XIcon } from 'lucide-react'
import RawPrompt from '../prompt'
import { handleARcode } from '../utilities';


function Intake() {

  const apiKey = '031a052329241fa8365571d6e816ab01824905f89adac9875c66f54d858e5283'
  const { asReportedcode, setasReportedcode, selectedproduct, setselectedproduct, initial_info, setinitial_info, Output, setOutput, isNewversion, setisNewversion } = useContext(AppContext)
  const asAnalysed_Codes = asReportedcode
  const [loading, setloading] = useState(false)
  const [filteredevent_types, setfilteredevent_types] = useState({})
  const [searchResult, setsearchResult] = useState([])
  const [Acode, setAcode] = useState([])
  const [source, setSource] = useState(Master)
  const [materialGrid, setmaterialGrid] = useState([])
  const [formattedDescription, setformattedDescription] = useState("")
  const [isOpened, setisOpened] = useState(true)
  const [typedcode, settyped] = useState("")
  const [ChangableIndex, setChangableIndex] = useState("")
  const [isaddClicked,setisaddClicked] = useState(false)
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

  function search(filteredevent_types, e) {
    if (!filteredevent_types) {
      return
    }
    const typed_word = e.target.value
    settyped(typed_word)
    const filter = filteredevent_types.filter((item) => item.toLowerCase().includes(typed_word.toLowerCase()))
    setsearchResult(filter)

  }
  function handleChangeReportedCodes(newcode, index) {
    console.log(newcode, index)
    asa[ChangableIndex] = newcode
    console.log(asReportedcode)



  }
  function handleAddReportedCode(code) {
    asAnalysed_Codes.push(code)
  }

  function IndexPasser(index) {
    setChangableIndex(index)

  }


  const hitter = async () => {
    setloading(true)
    const newprompt = RawPrompt.replace("{{Event Type}}", filteredevent_types).replace("{{initial info}}", initial_info)


    try {
      const response = await fetch("https://api.together.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          messages: [{ role: "user", content: newprompt }],
          max_tokens: 1000,
        })
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const parseddata = JSON.parse(aiResponse)
      if (parseddata["Entry Description"]) {
        let description = parseddata["Entry Description"];

        // Find "It was reported" and insert line breaks before it
        description = description.replace(
          /Batch # [^\s]+/,
          match => `${match}\n\n`
        );

        // Find "verbatim:" and insert line breaks before it
        description = description.replace(
          "Verbatim:",
          "\n\nVerbatim:\n"


        )

        setformattedDescription(description);
      } else {
        console.error("Entry Description is undefined in the response:", formattedDescription);
        // Handle the missing field appropriately
      }

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





  return (



    <div className='w-full lex flex-col bg-white text-white mx-auto'>

      {loading ? <LinearProgress /> : ""}

      {/* Input Field */}
      <section className="  flex flex-col  justify-center   lg:m-12    bg-white rounded-xl shadow-lg border border-gray-200 ">
        {/*Search Modal */}
        {isOpened &&
          <div className=' fixed inset-0 z-50 flex items-center justify-center bg-green-50 bg-opacity-50 border text-gray-700 '>
            <div className='bg-white border h-[50vh] w-[60vh]'>
              <div className='flex justify-center items-center bg-white m-3 rounded-lg '>
                <SearchIcon className='text-gray-500 ' />
                <input

                  className='w-full text-gray-700  m-3 space-x-3 border-none outline-none'
                  onChange={(e) => search(filteredevent_types, e)}
                  value={typedcode}
                  placeholder='Enter your code'
                />
                <XIcon onClick={() => setisOpened(false)} />
              </div>

              <div className='overflow-y-scroll border max-h-full'>
                {searchResult.length === 0 ?
                  <div className=' allEvents text-gray-600 w-full '>
                    {selectedproduct &&
                      NewEvents[selectedproduct].map((events, index) => (
                        <h1 className='hover:bg-blue-300 rounded-md p-2' 
                          onClick={() => {
                        if(isaddClicked){
                          handleAddReportedCode(code)
                          setisOpened(false)
                          setisaddClicked(false)
                        }
                        {
                          handleChangeReportedCodes(code, index)
                          setisOpened(false)  
                        }                          }} 
                          key={index}>
                          {events}</h1>
                      ))}
                  </div> :
                  <div className='searchResult'>
                    {searchResult.length > 0 && searchResult.map((code, index) => (
                      <h1 className='hover:bg-blue-300 rounded-md p-2' onClick={() => 
                       {if(isaddClicked){
                          handleAddReportedCode(code)
                          setisOpened(false)
                          setisaddClicked(false)
                        }
                        {
                          handleChangeReportedCodes(code, index)
                          setisOpened(false)  
                        }
                        
                      } }
                        key={index}>{code}</h1>
                    ))}
                  </div>

                }




              </div>


            </div>

          </div>}



        <header className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 block rounded-xl'>

          <h1 className='text-xl flex items-center font-semibold'>
            <FileText className="w-5 h-5 mr-2" />
            Incident Intake Form</h1>
          <p className='text-blue-100 text-sm mt-1'>Provide initial incident details for AI analysis</p>
        </header>

        <div className='p-6'>
          <div className='space-y-6'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TriangleAlert className='w-4 h-4 inline   mr-1 text-orange-500' />
              Incident Description *</label>
          </div>

          <textarea className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500"
            onChange={(e) => setinitial_info(e.target.value)}
            value={initial_info}
            placeholder="Describe the incident in detail (e.g., 'bent needle discovered during use')..."
          /></div>


        <div className='text-white w-full font-medium border-gray-500 focus:border-blue-500 focus:border-5'>
          {!isNewversion ?
            <div className='p-6'>
              <label htmlFor="dropdown" className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-2  '>
                <Package className='text-blue-500 ' />
                Affected Product *</label>              <select id="dropdown" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" value={selectedproduct} onChange={(e) => setselectedproduct(e.target.value)}>
                <option >Select your Product - Old </option>
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
            <div className='p-6'>
              <label htmlFor="dropdown" className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-2  '>
                <Package className='text-blue-500 ' />
                Affected Product *</label>              <select id="dropdown" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" value={selectedproduct} onChange={(e) => setselectedproduct(e.target.value)}>
                <option className='font-light' >Select your Product</option>
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
        <div className='p-6 w-full'>
          <button className={initial_info ? " w-full  bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200  h-14   p-2 text-lg" : " w-full px-4 py-1 bg-[#cccccc] bg-opacity-70 text-[#666666] cursor-not-allowed font-bold rounded-2xl p-2 text-lg h-14 "} disabled={initial_info ? false : true} onClick={hitter}>
            {loading ? <CircularProgress /> : "Analyse with AI"}

          </button>


          <button className='bg-gray-200 font-bold rounded-2xl p-2 text-lg h-14 w-28 mt-5 ' onClick={() => setisNewversion(prev => !prev)}>Change</button>
        </div>


      </section>

      {/* Results Fields*/}
      {Output && (
        <section className=' bg-white rounded-xl overflow-hidden text-gray-100 m-11 font-medium' >
          {formattedDescription && (
            <header className='bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4'>
              <h1 className='text-xl font-semibold text-white flex items-center'>
                <CircleCheck className='w-5 h-5 mr-2' />
                AI Analysis Results
              </h1>
              <p className='className="text-green-100 text-sm mt-1'>
                Complete incident analysis generated by AI
              </p>
            </header>
          )}


          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 bg-slate-100  '>
            {Object.entries(Output).map(([field, value], index) => {
              return Array.isArray(value) ? (
                <div className="bg-transparent rounded-lg overflow-hidden shadow divide-y divide-gray-700  ">

                  <div className="px-4 py-4 bg-blue-500 border-blue-500 text-blue-400   rounded-lg bg-opacity-25 text-xl  ">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </div>

                  {field === "Mapped Codes" ? (
                    <div>
                      <button
                      className='bg-blue-500'
                      onClick={()=>{
                        setisOpened(true),
                        setisaddClicked(true)
                      }}
                      >Add</button>

                        {value.map((unique, idx) => {
                      if (unique)
                        return (
                          <div key={idx} className=" flex justify-between">
                           
                            <h1 className='py-2 px-3 text-gray-300 font-medium  '>{unique}</h1>
                            <button onClick={() => { handleARcode, setisOpened(true), IndexPasser(idx) }} className='bg-red-500 rounded-lg mr-2 w-11 h-full m-2 font-medium'>Edit</button>

                          </div>)

                    })
                        }
                    </div>
                

                  ) : (
                    value.map((unique, idx) => (
                      <div key={idx} className=" ">
                        <p className=' py-2 px-3 text-gray-300  '>{unique}</p>
                      </div>
                    ))

                  )}
                </div>
              ) : (

                <div key={index} className="px-3 py-2 m-3 ">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </div>
                  <p className='px-3 py-2 bg-white rounded-md  text-sm text-gray-900 '>{value}</p>
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
            {formattedDescription && (
              <div className='w-full'>
                <h1 className='text-xs font-medium text-gray-600 mb-2'>Entry Description</h1>
                <textarea className='bg-white text-gray-600 w-full min-h-96' value={formattedDescription}></textarea>
              </div>
            )}


          </div>
          <div>
            <button className="bg-red" onClick={handleARcode}>Click</button>

          </div>


          {materialGrid.length > 0 && (
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
                  {materialGrid.map((code, index) => (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{index + 1}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.dtcode}<button className='border px-4 bg-red-600'>Edit</button></td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.ascode}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border text-wrap'>{code.arcode}</td>
                    </tr>
                  ))}


                </tbody>

              </table>
            </div>
          )}




        </section >)}

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
