import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";


function Ourcourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token; 

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  } 


  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return ( 
     <> 


    <div className=" p-3 space-y-2">
      <h1 className=" text-xl  md:text-3xl font-bold text-center  text-white mb-4">All Courses</h1>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course._id} className=" bg-gray-900 shadow-md rounded-lg p-4">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-30 w-full object-contain rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-white">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-white mt-2 text-sm"> 
              {course.description.length > 150
                ? `${course.description.slice(0, 150)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-300 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹3000</span>
              </div>
               
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
}

export default Ourcourses;
