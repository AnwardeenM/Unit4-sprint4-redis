const mongoose = require("mongoose");

module.exports = () => {
  return mongoose.connect(
    "mongodb+srv://AnwardeenM:anwar1234@cluster0.mnqdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
};
  
