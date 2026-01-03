
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { Navigate, Route, Routes } from "react-router-dom"
import  { Toaster } from 'react-hot-toast';
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import Videos from './components/Videos'
import Adminsignup from './admin/Adminsignup'
import Adminlogin from './admin/Adminlogin'
import Dashboard from './admin/Dashboard' 
import CourseCreate from './admin/CourseCreate' 
import Updatecourse from './admin/Updatecourse'
import Ourcourses from './admin/Ourcourses'
import Termscondition from './components/Termscondition' 
import Privacypolicy from './components/Privacypolicy'
import Refund from './components/Refund'

function App() { 

  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  // Parse the admin data to check if it's valid JSON
  const isAdminLoggedIn = (() => {
    try { 
      const adminData = JSON.parse(admin);
      return !!adminData; // converts to boolean
    } catch (e) {
      return false;
    }
  })();
  return <div>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login />}></Route> 

      <Route path="/courses" element={<Courses />}></Route>
      <Route path="/buy/:courseId" element={ < Buy/>  }></Route>
      <Route path="/user/purchases" element= { user? <Purchases /> : <Navigate to={"/login"} />  }></Route>
        <Route path="/videos" element={<Videos />}></Route>  
 
       <Route path="/terms-condition" element={<Termscondition />}></Route>  
 <Route path="/privacy-policy" element={<Privacypolicy />}></Route> 
 <Route path="/refund-cancellation" element={<Refund />}></Route> 

        {/* admin */}
           <Route path="/admin/signup" element={<Adminsignup />}></Route> 
              <Route path="/admin/login" element={<Adminlogin />}></Route> 
                 <Route path="/admin/dashboard" element={ isAdminLoggedIn ? <Dashboard /> 
                  : <Navigate to={"/admin/login"}/> }></Route>  
                 <Route path="/admin/create-course" element={ isAdminLoggedIn  ? < CourseCreate/> 
                : <Navigate to={"/admin/login"}/>  }> 
                 </Route> 
                 <Route path="/admin/update-course/:id" element={isAdminLoggedIn? <Updatecourse/> 
                  : <Navigate to={"/admin/login"}/> }> 
                 </Route>  
                  <Route path="/admin/our-courses" element={isAdminLoggedIn? < Ourcourses/>  
                   : <Navigate to={"/admin/login"}/> }>  
                  
                  </Route>   
    </Routes> 
  <Toaster />
  </div>
}

export default App
