import PropTypes from "prop-types"
import { useState, useContext, useEffect } from "react"
import CPR from '../CPR.json'
import { AppContext } from '../App.jsx';
import eventtype from "../product_event_map.json"


const DT = () => {

  useEffect(() => {
    console.log('DT Component Mounted');
  }, []);
  const [event_description, seteventdescription] = useState("")
  const { asReportedcode, setasReportedcode, selectedproduct, setselectedproduct } = useContext(AppContext)
  const asAnalysed_Codes = asReportedcode
  const affected_product = selectedproduct
  const allDT = {}
  const [readymade_DT, setReadymade_DT] = useState([])
  const [searchCode, setSearchcode] = useState("")
  const [filteredevent, setFilteredevent] = useState([])
  const [isOpened, setisOpened] = useState(false)
  const [isaddClicked,setisaddClicked] = useState(false)
  const [ChangableIndex,setChangableIndex] = useState("")

  {/* Function to change reported code manually*/}

  function handleChangeReportedCode(asChangableIndex,code){
         
    asAnalysed_Codes[asChangableIndex] = code
    console.log(asChangableIndex,code)
     
        
  }
  function handleAddReportedCode(code){
    asAnalysed_Codes.push(code)
    console.log(asAnalysed_Codes)
    return }

  function handlePasser(index){
    const res= index
    setChangableIndex(res)
    console.log(ChangableIndex)
  }
  
  
 
  {/*creating readymade_DT */ }
  const load_DT = (asReportedcode, affected_product) => {
    const possible_events = CPR[affected_product]
    for (const code of asReportedcode) {
      const seperate = possible_events[code]

      allDT[code] = {

        "Reportable Determination Rationale": seperate["Reportable Determination Rationale"],
        "Presumptively Reportable": seperate["Presumptively Reportable"]
      }


    }
    const readymade_DTs = []
    Object.entries(allDT).forEach(([code, value]) => {
      const rationale = value["Reportable Determination Rationale"]
      const isReportable = value["Presumptively Reportable"] === "Yes"


      const final_op =
        `
Description of the event/incident:

Verbatim: ${event_description}

Reportability Determination Rationale: ${rationale}

${isReportable ? ("This complaint is MDR reportable") : ("This complaint is not MDR reportable. There was no report of serious injury, medical intervention, or reportable device malfunction"
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
    const possible_events = eventtype[affected_product]
    const result = possible_events.filter((item) => item.toLowerCase().includes(searchCode.toLowerCase()))
    setFilteredevent(result)

  }



  return (


    <div className="w-full h-screen flex flex-col bg-black text-white ">
      <div className="border border-gray-600 flex flex-col m-8 lg:m-12 p-2 gap-4 ">
        <div className="arcode">
          <h1>Event Type</h1>
          <button className="border-blue-500 bg-blue-700 px-4 py-2  rounded-lg text-center" onClick={()=>{
            setisOpened(true)
            setisaddClicked(true)
          }}>Add</button>
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
          <button className=" w-24 h-10 bg-blue-700 font-medium rounded-2xl" onClick={() => load_DT(asAnalysed_Codes, affected_product)}>Trigger DT</button>
        </div>
        {isOpened && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 border">
            <div className=" border h-[50vh] w-[80vh] rounded-lg bg-gray-800  ">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full  text-white relative border">

                <div className=" w-full flex  bg-gray-700 bg-opacity-50 h-full">
                  <input className="bg-gray-800 h-12 rounded-xl px-4 py-4" placeholder="Search codes" onChange={(e) => search(e, affected_product, eventtype)} ></input>
                  <button onClick={()=>{
                    setisOpened(false)
                    
                    }}>Close</button>
                  {
                    searchCode && (
                      <div className="filtered absolute top-full left-0 border border-green-200 max-h-48  bg-gray-900 overflow-y-auto">
                        {filteredevent.length > 0 ? (
                          filteredevent.map((event, index) => (

                            <div onClick={() => {
                              if(isaddClicked){
                                handleAddReportedCode(event)
                                setisOpened(false)
                              }else{
                                handleChangeReportedCode(ChangableIndex,event)
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
