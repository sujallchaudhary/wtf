const Users = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const createUser = async (req, res) => {
    try{
    let {userName,file} = req.body;
    userName = userName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    userName = userName.trim().toLowerCase();
    const userCheck = await Users.find({userName});
    if(userCheck.length>0){
        userName = userName + Math.floor(Math.random() * 10000);
    }
    if(!file){
        file = "https://ui-avatars.com/api/?name="+userName+"&background=random";
    }
    const user =await Users.create({userName,profileImage:file});
    if(user){
        const token = jwt.sign({userId:user._id,userName},process.env.JWT_SECRET);
        if(token){
            return res.status(200).json({success:true,message:"User created successfully",token,data:user});
        }
        else{
            return res.status(500).json({success:false,message:"Token generation failed"});
        }
    }
    else{
        return res.status(500).json({success:false,message:"User creation failed"});
    }
    }
    catch(err){
        return res.status(500).json({success:false,message:"Internal server error"+err,data:null});
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findOne({userName:userId,isDeleted:false});
        if(user){
            return res.status(200).json({success:true,message:"User fetched successfully",data:user});
        }
        else{
            return res.status(404).json({success:false,message:"User not found",data:null});
        }
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"+error,data:null});
        
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId=req.body._id;
        console.log(userId);
        const user = await Users.findOneAndUpdate({_id:userId,isDeleted:false},{isDeleted:true});
        if(user){
            return res.status(200).json({success:true,message:"User deleted successfully",data:user});
        }
        else{
            return res.status(404).json({success:false,message:"User not found",data:null});
        } 
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"+error,data:null});  
    }
};

module.exports = {createUser, getUser, deleteUser};