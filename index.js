const express = require('express')
const { connectMongoDb } = require('./connection')
const { URL } = require('./models/url')

const urlRoute = require('./routers/url')
const staticRoute = require('./routers/staticRouter')
const {router} = require('./routers/user')

const cookieParser = require('cookie-parser')
const {restrictToLogggedInUserOnly,checkAuth,checkForAuthentication,restrictTo} = require('./middlewares/auth')
const path = require('path')


const app = express()
const PORT = 8001

// Connection
connectMongoDb('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("Error:", err))

// middleware 
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication)

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

// request on url route
// app.use('/url',restrictToLogggedInUserOnly, urlRoute)
app.use('/url',restrictTo(["Normal","Admin"]), urlRoute)

//request on static route
// app.use('/',checkAuth, staticRoute)
app.use('/', staticRoute)

// request on user route
app.use('/user',router)

// request for redirect url and update visitHistory
app.use('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId

    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        })
    res.redirect(entry.redirectURL)
})

// listen port request
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))