const router = require('express').Router();
const userModel = require('../db/model/userModel.js');
const bcrypt = require('bcrypt');
const verifyUser = require('../middleware/verifyUser.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


router.post('/registerUser', async function (req, res)
{   
    let { firstname, lastname, email, mobile, password } = req.body;
    
    let result = await userModel(req.body);
    
    const token = await result.generateAuthToken();
    result.save();

    res.cookie("mobile", mobile);  
    res.cookie("email", email);  
    res.cookie("jwt", token);

    res.redirect('/api/sendOTP');

})

router.post('/loginUser', async function (req, res)
{   
    let { email, password } = req.body;
    
    
    let result = await userModel.findOne({ email: email });
    
    let isMatch = await bcrypt.compare(password,result.password);

    if(isMatch)
        res.redirect("/dashboard");
    else
        res.redirect('/loginUser');
})

router.get('/sendOTP', verifyUser ,async function (req, res)
{

    let rand = Math.floor(Math.random() * (999999 - 100000 ) - 100000) ;

    res.cookie("otp", rand);
    let sid = process.env.SID;
    let auth_token = process.env.AUTH_TOKEN;
    let twilio = require('twilio')(side, auth_token);
    twilio.messages.create({
            from:process.env.TWILIO_MOBILE,
            to: req.cookies.mobile,
            body:`your otp is ${rand}`
        })
        
    .then((res)=>console.log("message send"))
    .catch(err=>console.log(err))

    res.redirect('/verifyOTP');
})


router.get('/sendEmailOTP', verifyUser , async function (req, res)
{

    let rand = Math.floor(Math.random() * (999999 - 100000 ) - 100000) ;

    res.cookie("eotp", rand);
    
    var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'somerealemail@gmail.com',
        pass: 'realpasswordforaboveaccount'
    }
    }));

    var mailOptions = {
    from: 'somerealemail@gmail.com',
    to: 'friendsgmailacc@gmail.com',
    subject: `your 6-digit otp is ${rand}`,
    text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });  

    res.redirect('/verifyEmailOTP');
})


router.post('/verifyMobileOTP', verifyUser , function(req, res)
{
    let otp = req.body.mobileOtp;

    
    if(otp === req.cookies.otp)
    {
        res.redirect("/verifyEmailOTP");
    }
    else
    {
        res.redirect("/verifyOTP");
    }
})

router.post('/verifyEmailOTP', verifyUser ,function(req, res)
{
    let otp = req.body.emailOtp;

    if(otp === req.cookies.eotp)
    {
        res.redirect("/loginUser");
    }
    else
    {
        res.redirect("/verifyEmailOTP");
    }
})


module.exports = router;