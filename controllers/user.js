const {User} = require('../models/user')
const {setUser} = require('../service/auth')

async function handleUserSignUp(req,res){
    const {name,email,password}=req.body
    console.log(name,email,password)
    await User.create({
        name,
        email,
        password
    })
    return res.render('login')
}

async function handleUserLogin(req,res){
    const {email,password}= req.body 
    const user = await User.findOne({email, password})
    if (!user) return res.render("login",{
        error:"Invalid Username or Password"
    })

    const token = setUser(user)
    console.log("token",token)

    res.cookie('token',token)
    return res.redirect('/')

}

module.exports={
    handleUserSignUp,
    handleUserLogin
}