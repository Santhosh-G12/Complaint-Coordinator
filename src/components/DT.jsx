import PropTypes from "prop-types"
import { useState, useContext, useEffect } from "react"
import CPR from '../NEW.json'
import { AppContext } from '../App.jsx';
import eventtype from "../product_event_map.json"
import NewCPR from '../Master.json'
import NewEvents from '../NewEvents.json'


const DT = () => {

  useEffect(() => {
    console.log('DT Component Mounted');
    console.log(selectedproduct)
  }, []);

  const [event_description, seteventdescription] = useState("")
  const { asReportedcode, setasReportedcode, selectedproduct, setselectedproduct, isNewversion, setisNewversion } = useContext(AppContext)
  const asAnalysed_Codes = asReportedcode

  const [selectedProduct, setSelectedProduct] = useState("")
  const allDT = {}
  const [readymade_DT, setReadymade_DT] = useState([])
  const [searchCode, setSearchcode] = useState("")
  const [filteredevent, setFilteredevent] = useState([])
  const [isOpened, setisOpened] = useState(false)
  const [isaddClicked, setisaddClicked] = useState(false)
  const [ChangableIndex, setChangableIndex] = useState("")
  const [rationaleVersion, setrationaleVersion] = useState("Reportability Determination Rationale")
  const [reportableVersion, setreportableVersion] = useState("Reportable? Yes/No")

  useEffect(() => {
    if (!isNewversion) {
      setrationaleVersion("Reportable Determination Rationale")
      setreportableVersion("Presumptively Reportable")
    }
  }, [isNewversion])

  {/* Function to change reported code manually*/ }

  function handleChangeReportedCode(asChangableIndex, code) {

    asAnalysed_Codes[asChangableIndex] = code
    console.log(asChangableIndex, code)


  }
  function handleAddReportedCode(code) {
    asAnalysed_Codes.push(code)
    console.log(asAnalysed_Codes)
    return
  }

  function handlePasser(index) {
    const res = index
    setChangableIndex(res)
    console.log(ChangableIndex)
  }
  function tester() {
    console.log(filteredevent)
    console.log("Hi")
    console.log(selectedProduct)
  }


  {/*creating readymade_DT */ }
  const load_DT = (asReportedcode, affected_product) => {
    const events = isNewversion ? NewCPR : CPR
    const possible_events = events[affected_product]
    for (const code of asReportedcode) {
      const seperate = possible_events[code]

      allDT[code] = {

        "Reportability Determination Rationale": seperate[rationaleVersion],
        "Reportable? Yes/No": seperate[reportableVersion]
      }


    }
    const readymade_DTs = []
    Object.entries(allDT).forEach(([code, value]) => {
      const rationale = value["Reportability Determination Rationale"]
      const isReportable = value["Reportable? Yes/No"] === "Yes"


      const final_op =

        `Description of the event/incident:

Verbatim: "${event_description}"

Reportability Determination Rationale: ${rationale}

${isReportable ? ("This complaint is MDR reportable.") : ("This complaint is not MDR reportable. There was no report of serious injury, medical intervention, or reportable device malfunction."
        )}

Event Type: ${code} 
        `
      readymade_DTs.push(final_op)
    })
    setReadymade_DT((prev) => [...prev, ...readymade_DTs])
    console.log(readymade_DT)
  }
  const copyDT = (DTid) => {
    const content = readymade_DT[DTid]
    navigator.clipboard.writeText(content)
      .then(() => {
        alert("textcopied")
      })
  }
  const search = async (e, affected_product, eventtype) => {
    const code = e.target.value
    await setSearchcode(code)
    console.log(`affected is ${selectedProduct}`)
    console.log(NewEvents)
    const possible_events = NewEvents[selectedProduct]
    const result = possible_events.filter((item) => item.toLowerCase().includes(searchCode.toLowerCase()))
    setFilteredevent(result)
  }



  return (


    <div className="w-full min-h-screen flex flex-col bg-black text-white  ">
      <div className="border border-gray-600 flex flex-col m-8 lg:m-12 p-2 gap-4 ">
        <div className="arcode">
          
          <div className="p-2">
            {/* Selecting Product */}
            <label htmlFor="dropdown" className='text-2xl text-blue-500 font-medium '>Affected Product</label>
            <select id="dropdown" className="bg-black font-bold text-xl focus:border overflow-hidden w-full" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
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
          <div className="mt-5 p-2">
              <h1 className="text-2xl text-blue-500 font-medium ">Event Type</h1>
              <button className="border-blue-500 bg-blue-700 px-4 py-2  rounded-lg text-center" onClick={() => {
                setisOpened(true),
                  setisaddClicked(true),
                  tester()
              }}>Add</button>
          </div>
          
          <div className="flex flex-col">
            {asAnalysed_Codes.map((codes, index) => (
              <div className="border border-gray-950 flex justify-between w-3full max-w-[700px] text-xs  md:text-lg lg:text-xl font-medium bg-gray-500 bg-opacity-40 px-2 py-2 rounded-xl" key={index}>
                <h1>{codes}</h1>
                <button onClick={() => {
                  setisOpened(true)
                  setisaddClicked(false)
                  handlePasser(index)
                }} className=" border-blue-500 bg-blue-700 px-4 py-2  rounded-lg text-center" >Edit</button>
              </div>
            ))}
          </div>
        </div>



        <textarea className=" bg-gray-800 h-48 px-4  py-4 rounded-xl" placeholder="Paste the Descrption" onChange={(e) => seteventdescription(e.target.value)}></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {readymade_DT.map((DT, index) => (

            <div key={index} className=" m-4 flex flex-col shadow-lg shadow-yellow-400 rounded-lg border  hover:shadow-xl">
              <h1 className="text-blue-600">DT {index}</h1>

              <button className="rounded-lg text-black bg-blue-600 hover:bg-blue-700 shadow-md transition-colors duration-300 m-3 " onClick={() => copyDT(index)}>Copy</button>
              <textarea className="w-full h-[400px] bg-gray-800 text-white border border-blue-600 rounded-lg p-4 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all duration-200 placeholder-gray-500" value={DT}></textarea>

            </div>
          ))
          }
          <button className=" w-24 h-10 bg-blue-700 font-medium rounded-2xl" onClick={() => load_DT(asAnalysed_Codes, selectedProduct)}>Trigger DT</button>
        </div>
        {/* Search Bar */}
        {isOpened && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 border ">
            <div className="  h-[50vh] w-[80vh] rounded-lg bg-gray-800  ">
                <div className="bg-gray-400 p-6 border flex gap-5 flex justify-center">
                  <input className="bg-gray-800 h-12 rounded-xl px-4 py-4" placeholder="Search codes" onChange={(e) => search(e, selectedProduct, eventtype)} ></input>
                  <button className="bg-gray-900 px-5 rounded-lg" onClick={() => {
                    setisOpened(false)

                  }}>Close</button>
                </div>
              
              {
                searchCode && (
                  <div className="filtered border border-green-200 h-full  bg-gray-900 
                       overflow-y-auto">
                    {filteredevent.length > 0 ? (
                      filteredevent.map((event, index) => (

                        <div onClick={() => {
                          if (isaddClicked) {
                            handleAddReportedCode(event)
                            setisOpened(false)
                          } else {
                            handleChangeReportedCode(ChangableIndex, event)
                            setisOpened(false)
                          }

                        }} className="hover:bg-blue-500 cursor-pointer z-50 border  " key={index}>{event}</div>
                      ))) : (
                      <div>No result found</div>
                    )
                    }

                  </div>
                )}
            </div>
            </div>
          


        )}

      </div>
    </div>



  )
}
DT.propTypes = {
  asReportedcode: PropTypes.array.isRequired,
  selectedproduct: PropTypes.string.isRequired
}

export default DT
