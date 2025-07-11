

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 border-t border-gray-800 py-2">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-400">&copy; 2025 Complaint Coordinator. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400">Terms</a>
          <a href="#" className="text-gray-400 hover:text-blue-400">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-blue-400">Contact</a>
        </div>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer
