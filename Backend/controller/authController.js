import {User} from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try{
        const {name, email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
              message:"required fields are missing!!"
            })
          }
          const existingUser = await User.findOne({email})
          if(existingUser){
              return res.status(400).json({
              message:"user already exists!"
             })
           }
        const hashpas = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password:hashpas
        })
     await newUser.save();
     res.status(201).json({
        success : true,
        message: "signup successful",
        data:{
            id: newUser.id,
            name:newUser.name,
            email:newUser.email
        }
     })
     }catch(err){
        res.status(400).json({
            success: false,
            message: "signup failed!",
            error : err.message
        })
    }
};

export const login = async (req, res) => {
      try{
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).
            json({message:" fill the required fields"})
        }
        const existingUser = await User.findOne({email});
            if (!existingUser) {
                return res.status(400).json({
                message: "User not found",
             });
            }

        const isMatch = await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message: "invalid Credentials . password did not matched"
            })
        }
       
        const token = jwt.sign(
            {
                user_id :existingUser._id,
                email:existingUser.email,
            },
            
                process.env.SECRET_KEY,
                {expiresIn : "7d"});
                console.log("YOUR TOKEN",token);
       
          return res.status(200).json({
            success: true,
            data:{
                user_id : existingUser.id,
                email: existingUser.email,
                name : existingUser.name,
                token
            }
           
        })        
         
      }catch(err){
        res.status(400).json({
            success: false,
            message: "login failed!",
            error : err.message
        })
    }
};

