const http = require('http');
const express = require('express');
const socketio = require('socket.io');

// const _express = require('./server/express');

const app = express();
const router = express.Router();

const clientPath = `${__dirname}/client/`;
const modulesPath = `${__dirname}/node_modules/`;
const SERVER_PORT = 4000;

router.get('/', function(req, res, next) {
  res.end()
})

app.use('/', express.static(clientPath));
app.use('/modules', express.static(modulesPath))


const server = http.createServer(app);
const io = socketio(server);

// let { connection } = _express(io)

// connection()


server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(SERVER_PORT, () => {
  console.log('Server started on', SERVER_PORT);
});