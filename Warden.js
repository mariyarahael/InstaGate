import React from "react";
import { Link } from "react-router-dom";

const Warden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex bg-gray-800 text-white rounded-xl shadow-lg w-full max-w-4xl">
        
        {/* Sidebar */}
        <div className="hidden md:flex flex-col justify-between p-6 bg-gray-700 rounded-l-xl w-1/3">
          <h2 className="text-3xl font-extrabold text-blue-400">👋 Hi, Warden!</h2>
          
          <div className="flex-grow flex flex-col justify-center mt-4 space-y-3">
            <Link to="/profile" className="py-3 px-4 bg-gray-600 hover:bg-gray-500 rounded-xl text-center">
              Profile
            </Link>
            <Link to="/settings" className="py-3 px-4 bg-gray-600 hover:bg-gray-500 rounded-xl text-center">
              Settings
            </Link>
          </div>

          <button className="py-3 px-4 bg-red-600 hover:bg-red-500 rounded-xl text-center font-semibold">
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-6">
          <h3 className="text-2xl font-bold text-center mb-6">Dashboard</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/book-cab">
              <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold">
                Book a Cab
              </button>
            </Link>
            <Link to="/student-log">
              <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold">
                Student Log
              </button>
            </Link>
            <Link to="/home-requests">
              <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold">
                Requests for Home
              </button>
            </Link>
            <Link to="/movement-requests">
              <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg font-semibold">
                Requests for Movement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warden;