import React, { useState } from "react";
import logo from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

function Adminlogin() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
     const [ErrorMessage, setErrorMessage] = useState("");
 const navigate=useNavigate()
   
  const handleSubmit =async(e) => {
    e.preventDefault();
     
    try {
     const response  = await axios.post(`${BACKEND_URL}/admin/login`, {
       
       email,
       password,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }) 
      console.log("Admin Login Successfull : ", response.data);
      localStorage.setItem("admin", JSON.stringify(response.data));
      toast.success(response.data.message);
     // Use a full page navigation so `App` re-reads localStorage and `isAdminLoggedIn` becomes true
     window.location.href = "/admin/dashboard";
   
    } catch (error) {  
      if(error.response){  
        setErrorMessage(error.response.data.errors ||"Admin login failed") 
      }
    } 
  } 


    return (
      <div className=" ">
        <div className="h-screen container mx-auto flex  items-center justify-center text-white">
          {/* Header */}
          <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5  ">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
              <Link to={"/"} className="text-xl md:text-3xl  text-fuchsia-300 font-bold ">
                CourseHub
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link   
              to={"/admin/signup"}
               className="bg-white text-black px-3 py-2  md:px-6 md:py-3 font-bold outline-none rounded-2xl hover:bg-amber-100 "
              >
                Signup
              </Link>
             
            </div>
          </header>

          {/* Signup Form */}
          <div className="bg-gray-900 p-6  rounded-lg shadow-lg w-[500px] m-6 md:m-0 mt-20">
            <h2 className="text-2xl font-bold mb-3 text-center">
              Welcome to <span className="text-fuchsia-300 ">CourseHub</span>
            </h2>
            <p className="text-center text-gray-500 mb-4">
              Please login to manage Dashboard
            </p>

            <form onSubmit={handleSubmit} >
          
              <div className="mb-2">
                <label htmlFor="email" className=" text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="xyz@gmail.com"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className=" text-gray-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="********"
                    required
                  />

                </div>
              </div>
{ ErrorMessage &&(
                 <div className="text-red-400 text-center" >{ErrorMessage}</div>
              )}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default Adminlogin;

