import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    studyField: { type: String, required: true },
    profilePicture:{
        type:String,
        default:"",
    },
    bannerImg:{
        type:String,
        default:"",
    },
    headline:{
        type:String,
        default:"User"
    },
    location:{
        type:String,
        default:"Earth",
    },
    about:{
        type:String,
        default:"",
    },
    education:[
        {
            school:String,
            fieldOfStudy:String,
            startYear:Number,
            endYear:Number,
        },
    ],
    connections:[{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    chatConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    

},{timestamps:true})

const User = mongoose.model("User",userSchema);

export default User;