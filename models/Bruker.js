const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fornavn: String,
    etternavn: String,
    epost: {
        type: "String", 
        required: true,
        unique: true
    },
    rolle: {
        type: "String",
        enum: ["student", "admin"],
        required: true,
        default: "student"
    }
})


const User = mongoose.model("User", userSchema);

module.exports = User;