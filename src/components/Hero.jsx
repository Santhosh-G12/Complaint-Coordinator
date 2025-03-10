
const Hero = () => {
  return (
    <div>
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
    
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-400"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-600"></div>
      <div className="absolute top-40 right-40 w-20 h-20 rounded-full bg-blue-300"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Transform Complaints into <span className="text-blue-400">Opportunities</span></h2>
          <p className="text-xl text-blue-100 mb-8">Streamline your complaint management process with our intuitive platform designed to improve resolution times and customer satisfaction.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow-lg transition duration-200 font-bold text-white">Get Started</a>
            <a href="#" className="bg-transparent border-2 border-blue-400 hover:bg-blue-800 px-6 py-3 rounded-lg transition duration-200 font-bold text-blue-200">Watch Demo</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative bg-gray-800 p-6 rounded-xl shadow-2xl border border-blue-800 w-full max-w-md">
            <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">New</div>
            <h3 className="text-xl font-semibold text-blue-100 mb-4">Quick Complaint Entry</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-blue-300 text-sm">Category</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                  <option>Product Defect</option>
                  <option>Service Issue</option>
                  <option>Billing Problem</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-blue-300 text-sm">Description</label>
                <textarea className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white h-24"></textarea>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">Submit Complaint</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    </div>
  )
}

export default Hero
