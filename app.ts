import express from "express";
import path from "path";
import { Server } from "socket.io";
const app = express();
const port = process.env.port || 4000;
const server = app.listen(port, () =>
  console.log(`server runs at port${port}`)
);

const io = new Server(server);
app.use(express.static(path.join(__dirname, "public")));
// app.set("views", path.join(__dirname, "public"));
// app.set("view engine", "ejs");
// app.get("/",(req,res)=>{
//     res.render(index)
// });
let socketsconnected: any = new Set();
io.on("connection", onConnected);
function onConnected(socket: any) {
  console.log("socket connected", socket.id);
  socketsconnected.add(socket.id);
  io.emit("clients-total", socketsconnected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketsconnected.delete(socket.id);
    io.emit("clients-total", socketsconnected.size);
  });

  socket.on("message", (data: any) => {
    // console.log(data)
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data: any) => {
    socket.broadcast.emit("feedback", data);
  });
}
