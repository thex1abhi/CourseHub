import jwt from "jsonwebtoken"  
import config from "../config.js" 

function adminMiddleware(req,res,next){ 
  // console.log("Midddleare runnig");
  
  const authHeader=req.headers.authorization; 
  // console.log(authHeader);
  
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({errors:"No token provided"})
  }  

  const token=authHeader.split(" ")[1];   
  // console.log(token);
  
  try {
     const decoded=jwt.verify(token,config.JWT_ADMIN_PASSWORD) 
      req.adminId=decoded.id ; 
 
     next();
  } catch (error) {
     return  res.status(401).json({ errors: "  Invalid/Expires token " })
  }
} 

export default adminMiddleware;