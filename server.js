const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require("body-parser");
const router = express.Router();
const socketIo = require("socket.io");
const index = require("./index");

const app = express();
app.use(cors());
const PORT = 5000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
var sess = {}
console.log(sess)

// add router in the Express app.
app.post('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/put', (req, res) => {
    sess['ACCOUNT'] = req.body.address;
    console.log(sess['ACCOUNT']);
    res.send('ok');
});

app.post('/delete', (req, res) => {
    sess['ACCOUNT'] = '';
    console.log(sess);
    res.send('ok');
});

app.post('/get', (req, res) => {
    res.send(sess['ACCOUNT']);
    console.log(sess);
});

app.use("/", router);

//------webrtc
let broadcaster;
const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
});

server.listen(PORT, (err) => {
    if (!err)
    console.log(`Server is running on port ${PORT}`)
    else
    console.log("Error occurred, server can't start", error);
});

