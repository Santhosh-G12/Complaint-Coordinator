
const Navbar = () => {
    const fields = ["Intake","Decision Tree"]
  return (
    <div>
      <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-lg border-b border-blue-800">
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-900 p-2 rounded-lg shadow border border-blue-700">
          <span className="text-blue-400 text-xl font-bold">CC</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-wider text-blue-100">Complaint Coordinator</h1>
          <p className="text-sm text-blue-300 tracking-wide">Streamlining resolution management</p>
        </div>
      </div>
      
      <nav className="mt-4 md:mt-0 flex flex-wrap items-center space-x-6">
        <a href="#" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow transition duration-200 font-medium text-white">New Complaint</a>
      </nav>
    </div>
  </header>
    </div>
  )
}

export default Navbar
