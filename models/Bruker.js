const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fornavn: String,
    etternavn: String,
    epost: String
})


const User = mongoose.model("User", userSchema);

module.exports = User;