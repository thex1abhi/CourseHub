import axios from "axios";
import React, { useState, useEffect,useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom"; 
import { BACKEND_URL } from "../../utils/utils";


export default function UpdateCourse() {   
  const {id}=useParams();   
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setimagePreview] = useState("");
  const [loading, setloading] = useState(true);
    

const navigate=useNavigate(); 

  function resetForm() {
    setTitle("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreviewUrl(null);
  } 
    
  useEffect(() => {
      const fetchCouseData = async()=>{
        try {
           const {data}=await axios.get(`${BACKEND_URL}/course/${id}`,{
            withCredentials:true
           }) 
           console.log(data) 
           setTitle(data.course.title)
           setDescription(data.course.description)
           setPrice(data.course.price)
            setImage(data.course.image.url)
            setimagePreview(data.course.image.url)
           setloading(false) 
        } catch (error) {
            console.log( error)
            toast.error ( "Failed to fetch Course Data") 
            setloading(false) 
          }
      } 
     fetchCouseData()
  }, [id]); 
  
   


  const changePhotoHandler =(e)=>{
    const file=e.target.files[0] 
    const reader=new FileReader()
    reader.readAsDataURL(file)
    reader.onload=()=>{
   setimagePreview(reader.result)
   setImage(file) 
    }
  } 
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title",title);
    formData.append("description",description)
    formData.append("price",price)
    formData.append("image",image);

     const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token; 
    console.log(token);
    if (!token) {
      navigate("/admin/login");
      return;
    } 
    try {
      const response=await axios.put(`${BACKEND_URL}/course/update/${id}`,formData,{
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials:true
      }) 
      console.log( response.data)
      toast.success( response.data.message || "Course Updated Successfully");
      navigate("/admin/our-courses")
      setTitle("");
      setPrice("")
      setDescription("")
      setImage("")
      setimagePreview("") 
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors || " Error Updating Course")
    }
  }

  return ( 

<>
    <div className=" bg-gray-900  p-2">
            <div className="flex justify-center-safe items-center gap-2   mb-1">
              
              <h2 className="text-lg  text-white font-semibold"> Update Course</h2>
           
            <nav className="flex gap-3">
              <Link to="/admin/our-courses">
                <button className="w-full  hover:bg-gray-600 text-white px-2 py-2 rounded">
                  Our Courses
                </button>
              </Link>
              <Link to="/admin/create-course">
                <button className="w-full  hover:bg-gray-600 text-white  px-2 py-2 rounded">
                  Create Course
                </button>
              </Link>
    
              <Link to="/admin/dashboard">
                <button className="w-full hover:bg-gray-600 text-white px-3 py-2 rounded">
                  Dashboard
                </button>
              </Link>
            </nav>
          </div> 
           </div>
    <div className="max-w-2xl  mt-2  text-white mx-auto p-6 bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl text-white font-semibold mb-3">Update Course</h2>

      <form onSubmit={handleUpdateCourse} className="space-y-2">
       
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
           
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
         
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-vertical"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (INR)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            
            className="w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
         
            onChange={changePhotoHandler}
            type="file"
            accept="image/*"
            className="block"
          />

          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm mb-2">Preview:</p>
              <img
                src={imagePreview}
                alt="preview"
                className="w-48 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            
            className="px-4 py-2 rounded-2xl  shadow-sm font-medium hover:opacity-90 disabled:opacity-60 bg-indigo-600 text-white"
          >
           Submit   
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-2 rounded-lg border hover:text-black hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
  
        <p className="text-xs text-gray-500">Tip: Images under 5MB work best.</p>
      </form>
    </div> 
    </>
  );
}

 