import { useState } from "react"

const AI_Tool = () => {
  const [typedText,setTypedText] = useState("")
  const [response,setResponse] = useState("")
  const apiKey = '031a052329241fa8365571d6e816ab01824905f89adac9875c66f54d858e5283'

  const launcher = async () => {
    if (!typedText.trim()) return;

    
    try {
      const res = await fetch("https://api.together.ai/v1/chat/completions ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
          messages: [{ role: "user", content: typedText }],
          max_tokens: 1000,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const aiResponse = data.choices[0]?.message?.content || "No response received.";
      const answer = cleaner (aiResponse)
      setResponse(answer);
      console.log(aiResponse)

    } catch (err) {
      console.error(`Error: ${err.message}`);
      setResponse("");
    } finally {
      null
    }
  };
  function cleaner(raw){
    if (!raw){
      return
    }else{
      const startIndex = raw.indexOf("<think>")
      const endIndex = raw.indexOf("</think>")
      if(startIndex !==-1 & endIndex !== -1){
        const result = raw.slice(endIndex+8).trim()
        return result
      }
      return raw
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white p-5 border"> 
      <div className="flex border mt-10 justify-center items-center    ">
        
        <textarea  onChange={(e)=>setTypedText(e.target.value)} value={typedText} className="border   m-5 w-full  min-h-10 p-2 text-wrap bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-200 placeholder-gray-500  " placeholder="Enter your message"/>
        <button onClick={launcher} className="border m-5 p-2 rounded-xl bg-blue-500 ">Submit</button>
       
        
      </div>
      <div className="border mt-10 bg-slate-900">
        <pre className="whitespace-pre-wrap overflow-auto p-3 ">
            {response}
          </pre>
      </div>
      
      
      
    </div>
  )
}

export default AI_Tool
