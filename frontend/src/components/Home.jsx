import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, Links } from "react-router-dom";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import axios from "axios"
import toast from "react-hot-toast"; 
import { BACKEND_URL } from "../../utils/utils";

function Home() {

    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    useEffect(()=>{
     const token=localStorage.getItem("user");
        if(token){
            setIsLoggedIn(true)
        }else{ 
            setIsLoggedIn(false)
        }
    },[]) 

    const HandleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`,   {
        withCredentials:true,
       }   )
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
            } catch (error) {
                console.log("error in fetching course", error);
            }
        } 
        fetchCourses();
    }, [])

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return <div className=" text-white  container mx-auto" >
        {/*Header*/}

        <div  >
            <header className="flex items-center justify-between mt-3 " >
                <div className="flex items-center gap-5" >
                    <img src={logo} alt="" className="w-12 h-12 rounded-full" />
                    <h1 className="text-xl md:text-3xl  text-fuchsia-300 font-bold  " >CourseHub</h1>
                </div >
                <div className="flex items-center gap-3 " >
                    {isLoggedIn ? (<>
                         <button onClick={HandleLogout} className="bg-red-500 text-white px-3 py-2  md:px-6 md:py-3 font-bold outline-none rounded-2xl hover:bg-red-700 "  > Logout</button>
                    </>) : (<>
                       <Link to={'/signup'} className="bg-white text-black px-3 py-2  md:px-6 md:py-3 font-bold outline-none rounded-2xl hover:bg-amber-100 "  > Signup</Link>
                        <Link to={"/login"} className="bg-purple-700 text-white px-3 py-2  md:px-6 md:py-3 font-bold  rounded-2xl  hover:bg-purple-500" > Login</Link>
                    </>)}


                </div>
            </header>
        </div>

        <div>
            <section className="mt-10 text-xl">

                <div > CourseHub  is a modern learning platform that empowers students and professionals to upgrade their skills with high-quality, affordable courses. Learn at your own pace, access expert-led lessons, and track your progress — all in one place.</div>
                <div className=" flex justify-center gap-3 mt-3" >
                    <Link  to={"/courses"} className="bg-white text-black md:px-6  md:py-3   px-3 py-2 font-semibold  hover:bg-neutral-400 duration-300 rounded-md   cursor-pointer" >Explore Courses</Link>
                    <Link to={"/videos"} className="bg-white text-black md:px-6 md:py-3 px-3 py-2  font-semibold  hover:bg-neutral-400 duration-300  rounded-md  cursor-pointer " >    Courses Videos </Link> 
                </div>
            </section>

            <section className="p-5"   >
                <Slider {...settings}>
                    {courses.map((course) => (
                        <div key={course._id} className="p-4">
                            <div className="relative shrink-0 w-62 transition-transform duration-300 transform hover:scale-105">
                                <div className="bg-gray-900 rounded-lg overflow-hidden">
                                    <img
                                        className="h-28 w-full  object-contain"
                                              src={course.image.url}
                                        alt="error"
                                    />
                                    <div className="p-2  text-center">
                                        <h2 className="text-xl  mb-4  font-bold text-white">
                                            {course.title}
                                        </h2>
                                     
                                     <Link  to={`/buy/${course._id}`}  className="  bg-teal-700 text-white py-2 px-4  rounded-full hover:bg-red-500 duration-300">  
                                            Buy Now 
                                      </Link>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </Slider>
            </section>
        </div>
        {/*footer*/}
        <hr className="mb-1 md:mb-3" />
        <footer  >

            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* div1 */}
                <div className="flex flex-col items-center md:items-start" >

                    <div className="mt-3 ml-4">
                        <p className="mb-2 md:font-bold">Follow Us</p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com"> <  CiFacebook className=" md:text-2xl hover:text-blue-500 " /> </a>
                            <a href="https://instagram.com"> <FaInstagram className="md:text-2xl  hover:text-rose-900" /> </a>
                            <a href="https://youtube.com"><FaYoutube className="md:text-2xl hover:text-red-500 " /> </a>
                        </div>
                    </div>
                </div>

                {/* div2 */}
                <div className="items-center flex flex-col" >
                    <p className="md:font-bold mb-2" > Contact Us : </p>
                    <ul className="space-y-2 text-gray-400" >
                        <li className="hover:text-white cursor-pointer duration-300" >Email : yabhishekk480@gmail.com</li>

                        <li className="hover:text-white cursor-pointer duration-300"> <a href="https://github.com/thex1abhi">Github</a></li>
                    </ul>
                </div>

                {/* div3 */}
                <div>
                    <div className="items-center flex flex-col" >
                        <p className="md:font-bold mb-2" > Copyrights &#169; 2025 </p>
                        <ul className="space-y-2 text-gray-400" >
                            <li   className="hover:text-white cursor-pointer duration-300" > 
                           <Link  to="/terms-condition">
                                Terms &Conditions </Link></li>
                            <li className="hover:text-white cursor-pointer duration-300"> 
                                
                                <Link to= "/privacy-policy">
                                Privacy Policy   </Link> </li>
                            <li className="hover:text-white cursor-pointer duration-300"> 
                                <Link to='/refund-cancellation' >
                                Refund & Cancellation </Link></li> 
                        </ul>
                    </div>
                </div>


            </div>
        </footer>

    </div>;
}

export default Home;
