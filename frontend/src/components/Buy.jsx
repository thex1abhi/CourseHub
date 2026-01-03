import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../utils/utils";
function Buy() {


    const { courseId } = useParams();
    const [loading, setLoading] = useState(false); 
    const [coursePrice, setCoursePrice] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [courseImage, setCourseImage] = useState("");
    const [courseError, setCourseError] = useState("");
     
    const user = localStorage.getItem("user");
    const token = user;
    const navigate = useNavigate();

    // Fetch course details on component mount
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
                const course = res.data.course;
                setCourseTitle(course.title);
                setCoursePrice(course.price);
                setCourseImage(course.image?.url);
            } catch (error) {
                console.error("Error fetching course:", error);
                setCourseError("Failed to load course details");
            }
        };
        if (courseId) fetchCourse();
    }, [courseId]);
    
    useEffect(() => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.body.appendChild(s);
      return () => document.body.removeChild(s);
    }, []);
     
    const handlePurchase = async () => {

        if (!token) {
            toast.error("Please login to buy the course");
            navigate("/login");
            return; // stop execution when not logged in
        } 
 
    try {
      setLoading(true);

      // 1) fetch course details to get price
      const courseResp = await axios.get(
        `${BACKEND_URL}/course/${courseId}`
      );  
      const price = courseResp.data.course.price;
      setCoursePrice(price); 

      // 2) create order on backend (note: route mounted at /api/v1/payment/create-order)
      const orderResp = await axios.post(
        `${BACKEND_URL}/payment/create-order`,
        { amount: price }
      );

      const order = orderResp.data.order;

      // 3) open razorpay
      const options = {
        key: orderResp.data.key || orderResp.data.keyId || "",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Course Payment",
        description: "Buy Course",
        order_id: order.id,
        handler: async function (response) {
          try {
            // verify payment on backend and include courseId
            const verify = await axios.post(
              `${BACKEND_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verify.data.success) {
              toast.success("Payment Successful");
              navigate("/purchases");
            } else {
              toast.error(verify.data.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("verify error", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          // optionally prefill email/phone
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Purchase failed");
    } finally {
      setLoading(false);
    }

    }

    return  (   

        
    <> 
    <div className="text-white flex h-screen items-center justify-center">
        <div className=" p-8 bg-gray-900 rounded-lg  ">
            {courseError ? (
                <div className="text-red-400 text-center">{courseError}</div>
            ) : (
                <>
                    {courseImage && (
                        <img 
                            src={courseImage} 
                            alt={courseTitle}
                            className="w-full h-54 object-contain rounded-lg mb-4"
                        />
                    )}
                    <h2 className="text-2xl font-bold mb-2 text-center">{courseTitle}</h2>
                    {coursePrice && (
                        <p className="text-xl text-center text-green-400 mb-6">
                            Price: ₹{coursePrice}
                        </p>
                    )}
                    <button 
                        className="w-full bg-blue-500 py-3 px-4 rounded-md hover:bg-blue-800 duration-300 disabled:opacity-50 font-semibold" 
                        onClick={handlePurchase} 
                        disabled={loading}
                    >
                        {loading ? "Processing...." : "Buy Now"}
                    </button>
                </>
            )}
        </div>
    </div>  
     </>
    )
}

export default Buy; 
