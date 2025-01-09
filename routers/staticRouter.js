const express = require('express')
const { URL } = require('../models/url')
const { restrictTo } = require('../middlewares/auth')

const router = express.Router()

// only accessible for admin not for normal user :
router.get('/url/admin', restrictTo("Admin"), async(req,res)=> {
    const allUrls = await URL.find({})

    return res.render('home', {
        urls: allUrls,
    }
    )
})

router.get('/', restrictTo(["Normal", "Admin"]), async (req, res) => {
    const allurls = await URL.find({ createdBy: req.user._id })

    return res.render('home', {
        urls: allurls,

    })
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

module.exports = router 