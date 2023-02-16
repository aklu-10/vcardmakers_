const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new  mongoose.Schema({
    firstname:String,
    lastname:String,
    email:{
        type: String,
        unique: true,
    },
    password:String,
    mobile:{
        type: String,
        unique: true,
    },
    tokens:[
        {
            token:String,
        }
    ]

});

userSchema.pre('save', async function(next)
{
    if(this.isModified("password"))
    {
        let result = await bcrypt.hash(this.password,12);
        this.password = result;
        next();
    }
})

userSchema.methods.generateAuthToken = async function()
{
    try{
        const token = await  jwt.sign({_id:this._id.toString()},'mysecretkeyisnotsecretbecauseanybodycanseethis');

        this.tokens = this.tokens.concat({token:token});
        return token;
    }
    catch(err)
    {
        console.log(err);
    }
}

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;


