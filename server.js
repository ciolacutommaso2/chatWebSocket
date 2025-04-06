const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

const users = [];
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log("socket connected: " + socket.id);
    io.emit("list", users);

    socket.on('name', (name) => {
        //add usente
        users.push({ socketId : socket.id, name : name}) 
        io.emit("list", users);
    })

    socket.on('message', (message) => {
    //quando mutente manda mess
      users.forEach((us) => {
        if (us.socketId === socket.id) {
            const user = us;
        }
      })
      
      if (user) {
            const res = `${user.name}: ${message}`;
            io.emit("chat", res); 
        }
    });
    socket.on('disconnect', () => { 
        console.log("disconnect-> " + socket.id);
        for (let i = 0; i < users.length; i++) {
            if (users[i].socketId === socket.id) {
                users.splice(i, 1);
                break; 
            }
        }

        io.emit("list", users);
    });
});

server.listen(conf.port, () => {
  console.log("server running on port: " + conf.port);

});