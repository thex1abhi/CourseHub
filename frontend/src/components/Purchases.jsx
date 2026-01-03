
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { BACKEND_URL } from "../../utils/utils";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);


  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const token = user

  console.log("purchases: ", purchases);

  // Token handling
  useEffect(() => {

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!token) {
    navigate("/login");

  }

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, []);

  // Logout
  const HandleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);

    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };



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
              <a href="/courses" className="flex items-center ">
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
            <h1 className="text-xl font-bold">Purchases</h1>
          </header>

          <section>
            {errorMessage && (
              <div className="text-red-500 text-center mb-4" > {errorMessage}</div>
            )}
          </section>

          <section>
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {purchases.map((purchase, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-lg shadow-md p-6 mb-6"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      {/* Course Image */}
                      <img
                        className="rounded-lg w-38 h-38 object-cover"
                        src={
                          purchase.image?.url || "https://via.placeholder.com/200"
                        }
                        alt={purchase.title}
                      />
                      <div className="text-center">
                        <h3 className="text-lg font-bold">{purchase.title}</h3>
                        <p className="text-gray-500">
                          {purchase.description.length > 100
                            ? `${purchase.description.slice(0, 100)}...`
                            : purchase.description}
                        </p>
                        <span className="text-green-700 font-semibold text-sm">
                          {purchase.price} only
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You have no purchases yet.</p>
            )}

          </section>

        </main>
      </div>

    </>
  )
}

export default Purchases;