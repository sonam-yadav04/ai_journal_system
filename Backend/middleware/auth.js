import jwt from "jsonwebtoken";

export const auth = async(req,res, next)=>{
    try{
    const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
}catch(err){
    res.status(401).json({
        message: "unauthorized user"
    });
    console.log(err)
}
}