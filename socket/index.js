const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUsers", (userid) => {
    !onlineUsers.some((user) => user.userid === userid) &&
      onlineUsers.push({
        userid,
        socketId: socket.id,
      });
    console.log("connection", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message to the server
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userid === message.recipientId );
    if (user) {
      console.log("Sending message to recipient:", message);
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
    
  });
  
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected:", onlineUsers);
  });
});

io.listen(3001); // Listen on port 3001
