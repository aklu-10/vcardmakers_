const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
require('./db/connection');
const verifyUser = require('./middleware/verifyUser.js');

require('dotenv').config();
const routes = require('./routes/route.js');

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname,"/public" )));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api",routes);

app.get("/", verifyUser ,(req,res)=>
{
    res.render("dashboard/index");
})

app.get("/registerUser",(req,res)=>
{
    res.render("index");
})

app.get("/verifyOTP", verifyUser ,(req,res)=>
{
    res.render("authentication/verifyOTP",{mobile:req.cookies.mobile});
})

app.get("/verifyEmailOTP", verifyUser , (req,res)=>
{
    res.render("authentication/verifyEmailOTP",{email:req.cookies.email});
})

app.get("/dashboard", verifyUser ,(req,res)=>
{
    res.render("dashboard/index");
})

app.get("/loginUser",(req,res)=>
{
    res.render("authentication/loginUser");
})


app.listen(PORT,()=>console.log(`listening on port ${PORT}`));
