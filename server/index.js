const express = require('express');
const app = express();
const connection = require('./database/connection');
const userRoute = require('./routes/userRoute');
const messageRoute = require('./routes/messageRoute');
const {verifyTokenFun} = require('./middlewares/jwt');
const cors = require('cors');
const {Server} = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const userSocketMap = {};

connection();

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.io = io;
    req.userSocketMap = userSocketMap;
    next();
});
io.on("connection", (socket) => {
    socket.on("register", (data) => {
        const {token,userId}=data;
        if(!verifyTokenFun(token)){
            return;
        }
        userSocketMap[userId] = socket.id;
    });
    socket.on("disconnect", () => {
        const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
    });
});

app.use('/users', userRoute);
app.use('/messages', messageRoute);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});