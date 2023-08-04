import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.get("/", (req, res) => {
    res.send("WORKING");
});

const server = createServer(app);

const io = new SocketIO(server);

const users = [{}];

io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on('joined', ({ user }) => {

        users[socket.id] = user;

        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat ${users[socket.id]} ` });

        socket.broadcast.emit('userJoined', { user: "Admin", message: ` ${users[socket.id]} has joined`, id: socket.id });
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]}  has left`, id: socket.id });
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    })

});

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
});