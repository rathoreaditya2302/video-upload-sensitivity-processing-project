require("dotenv").config();
const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const initSocket = require("./src/socket/socket");

connectDB();

const server = http.createServer(app);
const io = initSocket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
