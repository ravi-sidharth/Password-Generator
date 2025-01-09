require('dotenv').config()

const express = require('express')
const { connectMongoDb } = require('./DB/connection')
const { URL } = require('./models/url')

const urlRoute = require('./routers/url')
const staticRoute = require('./routers/staticRouter')
const {router} = require('./routers/user')

const cookieParser = require('cookie-parser')
const {checkForAuthentication,restrictTo} = require('./middlewares/auth')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8000

//Connect Database
connectMongoDb(process.env.Mongo_URL)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("Error:", err))

// middleware 
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication)

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use('/url',restrictTo(["Normal","Admin"]), urlRoute)

app.use('/', staticRoute)

app.use('/user',router)

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