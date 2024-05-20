const router = require('express').Router()
const Chat = require('../models/Chat')

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/chat', async (req, res) => {
  const chats = await Chat.find().populate('user', 'username')

  res.render('chat', { chats: chats.map(c => c.toObject()) })
})

module.exports = router
