function verifyUser(req,res,next)
{

    console.log(req.cookies.jwt);

    // remove ! in production
    if(!req.cookies.jwt && (req.cookies.otp!==0) && (req.cookies.eotp!==0))
        res.redirect("/registerUser")

    next();
}

module.exports = verifyUser;