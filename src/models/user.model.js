import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    eMail: {
        type: String,
        required: true,
        unique: true,   
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,   
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })

userSchema.pre("save", async function(next) 
{
    if(!this.isModified("password")) return next();
    
    this.password = bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) 
{
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    jwt.sign(
        {
            _id: this._id,
            eMail: this.eMail,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    jwt.sign(
        {
            _id: this._id,
            eMail: this.eMail,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
           expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}

export const User = mongoose.model("User", userSchema);
