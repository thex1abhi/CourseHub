
import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiHome2Fill } from "react-icons/ri";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";
function Courses() {

    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setloading] = useState(true);
   

    console.log("Courses:", courses)

    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    const HandleLogout = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/user/logout`, {
                withCredentials: true,
            })
            toast.success(response.data.message);
            localStorage.removeItem("user");
            setIsLoggedIn(false);
        } catch (error) {
            console.log("Error in logging out ", error);
            toast.error(error.response.data.errors || "Error in logging out");
        }
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`, {
                    withCredentials: true,
                })
                console.log(response.data.courses);
                setCourses(response.data.courses);
                setloading(false);
            } catch (error) {
                console.log("error in fetching course", error);
            }
        }
        fetchCourses();
    }, [])



    return (

        <>
            <div className="text-white    h-12 " >
                <nav  >
                    <ul className="flex justify-center  p-1 gap-1 bg-gray-900 md:p-2  md:gap-5 md:text-xl md:font-bold " >    
                        <li className="mb-4"> 
                            <a href="/" className="flex items-center ">
                                 <RiHome2Fill className="mr-1 invisible md:visible " /> Home
                            </a> 
                        </li>
                        <li className="mb-4">
                            <a href="#" className="flex items-center ">
                                 Courses
                            </a>
                        </li>
                        <li className="mb-4">
                            <a href="/purchases" className="flex items-center   ">
                                Purchases
                            </a>
                        </li>
                        <li className="" >
                            {isLoggedIn ? (
                                <Link to={"/"}
                                    className="flex items-center  "
                                    onClick={HandleLogout}
                                >
                                    <IoLogOut className="md:mr-1 invisible md:visible " /> Logout
                                </Link>
                            ) : (
                                <Link to={"/login"} className="flex items-center ">
                                    <IoLogIn className="   md:mr-1 invisible md:visible " /> Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>

            </div>


            <div className="text-white" >
                <main className="ml-0  w-full  p-5">
                    <header className="flex justify-between items-center mb-10">
                        <h1 className="text-xl font-bold">Courses</h1>
                    </header>

                    
                    <div className=" h-auto">
                        {loading ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : courses.length === 0 ? (
                            // Check if courses array is empty
                            <p className="text-center text-gray-500">
                                No course posted yet by admin
                            </p>
                        ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {courses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="border border-gray-200 rounded-lg p-4 shadow-sm"
                                    >
                                        <img 
                                            src={course.image.url}
                                            alt={course.title}
                                            className="rounded h-30 w-30 mb-2"
                                        />
                                        <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                                        <p className="  mb-2">
                                            {course.description.length > 100
                                                ? `${course.description.slice(0, 100)}...`
                                                : course.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-xl">
                                                ₹{course.price}{" "}
                                                <span className="text-gray-600 line-through">3000</span>
                                            </span>
                                           
                                        </div>

                                        {/* Buy page */}
                                        <Link
                                            to={`/buy/${course._id}`} // Pass courseId in URL
                                            className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                                        > 
                                            Buy Now
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main> </div>
        </>

    )
 
}

export default Courses;
