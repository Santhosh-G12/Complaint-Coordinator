
import './App.css';
import { useState} from "react"
import TextField from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from '@mui/material';


function App() {
  const apiKey = '031a052329241fa8365571d6e816ab01824905f89adac9875c66f54d858e5283'
  
  const [initial_info , setinitial_info] = useState("")
  const [Output,setOutput] =useState({})
  const [loading, setloading] =useState(false)


  const hitter = async()=>{
    setloading(true)
    const prompt =`Extract the following information from the complaint description below and return ONLY a valid JSON object. Do NOT include any additional text, explanations, or formatting (e.g., Markdown backticks,dont add unexcepted token which may cause not resulting valid JSON). Use the exact structure and default values provided below:
    Additional Guidelines:
    1. Try to understand the complaint as much as depth as you can because if suppose we misunderstood the issue , which may cause serious problem to our team.
    2. Try to find no of issues as much as possible
    

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
  "Explanation": "Provide a detailed explanation of the reported issue(s) based on the complaint description."
}

Complaint Description:
${initial_info}

Example Output:
{
  "Material": "XYZ123",
  "Lot": "BATCH456",
  "Reported Issue": "The product stopped working after a week.",
  "Patient Harm": "No harm reported.",
  "Date of Event": "01/15/2023",
  "Sample Information": "Sample available for investigation.",
  "Follow-up Questions": [
    "Can you provide more details about the issue?",
    "Was the product used according to instructions?"
  ],
  "No of issues": "1",
  "Email id": "user@example.com",
  "Explanation": "The customer reported that the product stopped working after a week of use."
}
`

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
      console.log(aiResponse)
      const parseddata = JSON.parse(aiResponse)
      setOutput(parseddata)
      console.log(parseddata)

    }
    catch(error){
      console.error(`we are facing an ${error.message}`)
      return null
    }finally{
      setloading(false)
    }
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
      
      <label className="text-xl text-blue-500 font-bold">Output</label>

     
      <div className='flex gap-3 flex-wrap' >
        
        <div>
          {Object.entries(Output).map(([field,value],index)=>{
            return(
              <div key={index}>
                <h1 className='text-blue-400'>{field}</h1>
                <p>{value}</p>
                </div>
            )
          })}
        </div>
        
      </div>
    </div>
 </div>  
  )
}

export default App
