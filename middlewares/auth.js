const { getUser } = require('../service/auth')

function checkForAuthentication(req, res, next) {
    // const authorizationHeaderValue = req.headers["authorization"]
    // req.user = null
    // if (
    //     !authorizationHeaderValue ||
    //     !authorizationHeaderValue.startsWith('Bearer')
    // )
    //     return next()
    // const token = authorizationHeaderValue.split("Bearer ")[1]
    // const user = getUser(token)

    // req.user = user
    // return next()
    const tokenCookie = req.cookies?.token
    req.user = null

    if(!tokenCookie) return next()

    const user = getUser(tokenCookie)
    req.user = user
    return next() 
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/login')

        if (!roles.includes(req.user.role)) return res.end("Unauthorized")

        return next()
    }

}
// async function restrictToLogggedInUserOnly(req,res,next) {
//     // console.log(req)
//     // const userUid = req.cookies?.uid

//     const userUid = req.headers["authorization"]
//     if (!userUid) return res.redirect('/login')

//     const token = userUid.split(" ")[1]
//     const user = getUser(token)
//     if (!user) return res.redirect('/login')

//     req.user= user
//     next()
// }

// async function checkAuth(req,res,next) {
//     // const userUid = req.cookies?.uid
//     // console.log(req)
//     // const user = getUser(userUid)


//     const userUid = req.headers["authorization"]
//     const token = userUid.split(" ")[1]
//     console.log("token",userUid)
//     const user = getUser(token)

//     req.user= user
//     next()
// }

module.exports = {
    // restrictToLogggedInUserOnly,
    // checkAuth
    checkForAuthentication,
    restrictTo
}