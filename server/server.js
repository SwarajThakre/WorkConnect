// server.js
const express = require("express");
const { Client } = require("pg"); // Or use any DB client you're working with
const app = express();
const port = 5000;
const http = require("http");
const path = require("path");
const cors = require("cors");
// Using this for database
const bodyParser = require("body-parser");

const authenticationRoutes = require("./routes/authentication");
const chatRoutes = require("./routes/chatroute");
const userRoute = require("./routes/userroutes");
const messageRoute = require("./routes/messageroute");
const adminRoute = require("./routes/adminroute");
const accountRoute = require("./routes/accountroute");

app.use(bodyParser.json());

app.use(cors());
app.use(authenticationRoutes);
app.use("/api/users", userRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/acc", accountRoute);

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "postgre",
  port: 5432,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database successfully!");
    // Start the server only after the DB connection is successful
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });

// Start the server
// const server = http.createServer(app);
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
