const mongoose = require('mongoose');

mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/vcardmakers")
.then(()=>
{
    console.log("Database connection established");
})
.catch(err => console.log(err));

