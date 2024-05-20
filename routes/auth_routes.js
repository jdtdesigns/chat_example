const router = require('express').Router()
const User = require('../models/User')

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.cookie('token', { user_id: user._id }, {
      httpOnly: true
    })

    res.redirect('/chat')
  } catch (error) {
    console.log(error)

    res.redirect('/register')
  }
})

module.exports = router