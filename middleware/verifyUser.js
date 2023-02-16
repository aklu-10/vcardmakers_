function verifyUser(req,res,next)
{

    console.log(req.cookies.jwt);

    if(!req.cookies.jwt){
        res.redirect("/registerUser")
    }

    next();
}

module.exports = verifyUser;