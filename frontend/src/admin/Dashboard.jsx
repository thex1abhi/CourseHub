

import toast from "react-hot-toast";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import Ourcourses from "./Ourcourses";
import { BACKEND_URL } from "../../utils/utils";

function Dashboard() { 
  const navigate=useNavigate()
    const handleLogout = async () => { 
     
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, { 
         withCredentials: true 
      }); 
      
      toast.success(response.data.message); 
      localStorage.removeItem("admin"); 
    } catch (error) { 
       console.log("Error in logging out ", error);
      toast.error(error.response.data.errors );
    } 
  };
  return (
    <div className="">
    
      <div className=" bg-gray-900  p-2">
        <div className="flex justify-center-safe items-center gap-2   mb-5">
          
          <h2 className="text-lg  text-white font-semibold"> Admin Dashboard</h2>
       
        <nav className="flex gap-3">
          <Link to="/admin/our-courses">
            <button className="w-ful  hover:bg-gray-600 text-white px-2 py-2 rounded">
              All Courses 
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full  hover:bg-gray-600 text-white  px-2 py-2 rounded">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full  hover:bg-gray-600 text-white px-3 py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login" >
            <button
              onClick={handleLogout}
              className="w-full   hover:bg-red-700  text-white py-2 px-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div> 
       </div>
      <div className="flex   md:text-xl text-white justify-center">
        <Ourcourses/>
      </div>
    </div>
  );
}

export default Dashboard;
