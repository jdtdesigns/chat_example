const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const { engine } = require('express-handlebars')

const client = require('./config/client')

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const view_router = require('./routes/view_routes')
const auth_router = require('./routes/auth_routes')

const Chat = require('./models/Chat')
const User = require('./models/User')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.engine('.hbs', engine({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

io.on('connection', (socket) => {

  socket.on('message', async (msg) => {
    const cookies = cookie.parse(socket.request.headers.cookie)

    if (cookies.token) {
      const token = JSON.parse(cookies.token.slice(2))

      await Chat.create({
        text: msg,
        user: token.user_id
      })
      const user = await User.findById(token.user_id).select('username')

      io.emit('chat', { message: msg, user: user.username })
    }


  })
});

app.use('/', [view_router, auth_router])

client.once('open', () => {
  server.listen(3333, () => console.log('Server started on port', 3333));
})