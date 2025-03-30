import React from 'react'

const Hero = () => {
  return (
    <main className='bg-[url(./assets/bg.jpg)] min-h-screen bg-cover relative flex overflow-hidden  ' >
      
      <div className="title border absolute top-[30%] left-[40%] mr-5 flex flex-col ">
        <div>
          <h1 className='text-[3rem] font-extrabold text-white '>Turn Complaints into Solutions with <span className='text-[#23293A] font-extrabold '>AI-Powered Insights</span></h1>
        </div>
        <div>
          <h1>I am your Complaint Coordinator !!!</h1>
        </div>
        <div>
          <button>Get Started</button>
        </div>
      </div>

      

    </main>
  )
}

export default Hero
