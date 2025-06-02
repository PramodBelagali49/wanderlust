const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isValidatedEmail: {
        type: Boolean,
        default: false,
    },    
    profilePhoto: {
        type: String,
        default: "",
    }
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)
